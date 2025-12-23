"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/types/database";
import Header from "@/app/components/dashboard/Header";
import LeftSidebar from "@/app/components/dashboard/LeftSidebar";
import CreatePostCard from "@/app/components/dashboard/CreatePostCard";
import PostCard from "@/app/components/dashboard/PostCard";
import RightSidebar from "@/app/components/dashboard/RightSidebar";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  is_verified: boolean;
};

type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: Profile | null;
  likes: { user_id: string }[];
  comments: { count: number }[];
};

export default function DashboardFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [me, setMe] = useState<Profile | null>(null);

  /* ---------------- LOAD DATA ---------------- */

  const loadPosts = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role, bio, is_verified")
        .eq("id", user.id)
        .single();

      setMe(profile);
    }

    const { data } = await supabase
      .from("posts")
      .select(`
        id,
        user_id,
        content,
        created_at,
        profiles (
          id,
          full_name,
          avatar_url,
          role,
          bio,
          is_verified
        ),
        likes ( user_id ),
        comments ( count )
      `)
      .order("created_at", { ascending: false });

    setPosts((data as Post[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  /* ---------------- CREATE POST ---------------- */

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();

    // Guard: Block if not logged in
    if (!currentUserId) {
      console.error("Cannot create post: User not logged in");
      alert("You must be logged in to create a post");
      return;
    }

    if (!content.trim()) {
      return;
    }

    setPosting(true);

    const postData: Database['public']['Tables']['posts']['Insert'] = {
      user_id: currentUserId,
      content: content.trim(),
    };

    const { error } = await supabase.from("posts").insert(postData as any);

    if (error) {
      console.error("Failed to create post:", error);
      alert(`Failed to create post: ${error.message}`);
      setPosting(false);
      return;
    }

    console.log("Post created successfully");
    setContent("");
    setPosting(false);
    loadPosts();
  };

  /* ---------------- LIKE ---------------- */

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!currentUserId) return;

    // Optimistic UI
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: isLiked
                ? p.likes.filter((l) => l.user_id !== currentUserId)
                : [...p.likes, { user_id: currentUserId }],
            }
          : p
      )
    );

    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId);
    } else {
      const likeData: Database['public']['Tables']['likes']['Insert'] = {
        post_id: postId,
        user_id: currentUserId,
      };
      await supabase.from("likes").insert(likeData as any);
    }
  };

  /* ---------------- DELETE POST ---------------- */

  const handleDelete = (postId: string) => {
    // Optimistic UI update - remove post from list
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  /* ---------------- EDIT POST ---------------- */

  const handleEdit = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const newContent = prompt("Edit your post:", post.content);
      if (newContent !== null && newContent.trim()) {
        updatePost(postId, newContent.trim());
      }
    }
  };

  const updatePost = async (postId: string, newContent: string) => {
    // Use raw SQL to bypass TypeScript issues
    const { error } = await (supabase as any)
      .from("posts")
      .update({ content: newContent })
      .eq("id", postId);

    if (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } else {
      // Optimistic UI update
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, content: newContent } : p
        )
      );
    }
  };

  /* ---------------- SAVE POST ---------------- */

  const handleSave = (postId: string) => {
    console.log("Post saved:", postId);
    // Saved posts will be handled by PostCard component
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <Header avatarUrl={me?.avatar_url ?? undefined} />

      <main className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 px-4 py-6">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block md:col-span-3">
          <LeftSidebar profile={me} />
        </aside>

        {/* CENTER FEED */}
        <section className="md:col-span-9 lg:col-span-6 space-y-5">
          {me && (
            <CreatePostCard
              avatarUrl={me.avatar_url}
              value={content}
              onChange={setContent}
              onSubmit={handleCreatePost}
              loading={posting}
            />
          )}

          {loading ? (
            <p className="text-sm text-slate-500">Loading posts…</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-slate-500">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <PostCard
                  post={post}
                  currentUserId={currentUserId}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onSave={handleSave}
                />
              </article>
            ))
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3">
          <RightSidebar />
        </aside>
      </main>
    </>
  );
}
