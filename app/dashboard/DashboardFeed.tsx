"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/types/database";
import Header from "@/app/components/dashboard/Header";
import LeftSidebar from "@/app/components/dashboard/LeftSidebar";
import CreatePostCard from "@/app/components/dashboard/CreatePostCard";
import PostCard from "@/app/components/dashboard/PostCard";
import RightSidebar from "@/app/components/dashboard/RightSidebar";
import { extractMentions } from "@/lib/mentions";

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
  image_url?: string | null;
  gif_url?: string | null;
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

  /* ---------------- MENTION NOTIFICATIONS ---------------- */

  const handlePostMentions = async (postId: string, content: string, authorId: string) => {
    try {
      console.log("handlePostMentions called with:", { postId, content, authorId });

      const mentions = extractMentions(content);
      console.log("Extracted mentions:", mentions);

      if (mentions.length === 0) {
        console.log("No mentions found, returning early");
        return;
      }

      // Resolve usernames to user IDs
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, username")
        .in("username", mentions);

      console.log("Profile lookup result:", { profiles, profileError });

      type ProfileRow = { id: string; username: string | null };
      const typedProfiles = (profiles || []) as ProfileRow[];

      if (typedProfiles.length === 0) {
        console.log("No profiles found for mentions");
        return;
      }

      // Create mention notifications (excluding self-mentions)
      const notifications = typedProfiles
        .filter((profile) => profile.id !== authorId)
        .map((profile) => ({
          user_id: profile.id,
          actor_id: authorId,
          type: "mention" as const,
          entity_type: "post",
          entity_id: postId,
          is_read: false,
        }));

      console.log("Notifications to create:", notifications);

      if (notifications.length > 0) {
        const { data, error } = await supabase.from("notifications").insert(notifications as any);
        console.log("Notification insert result:", { data, error });
      }
    } catch (error) {
      console.error("Error creating mention notifications:", error);
    }
  };

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
        gif_url,
        image_url,
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
    console.log("🚀 DashboardFeed component mounted - mention notifications ready");
    loadPosts();
  }, []);

  /* ---------------- CREATE POST ---------------- */

  const handleCreatePost = async (e: FormEvent, gifUrl?: string | null) => {
    e.preventDefault();

    console.log("📝 handleCreatePost called with content:", content);

    // Guard: Block if not logged in
    if (!currentUserId) {
      console.error("Cannot create post: User not logged in");
      alert("You must be logged in to create a post");
      return;
    }

    // Require either content or a GIF
    if (!content.trim() && !gifUrl) {
      return;
    }

    setPosting(true);

    const postData: Database['public']['Tables']['posts']['Insert'] = {
      user_id: currentUserId,
      content: content.trim() || "", // Allow empty content if there's a GIF
      ...(gifUrl && { gif_url: gifUrl }),
    };

    const { data: newPost, error } = await supabase
      .from("posts")
      .insert(postData as any)
      .select("id")
      .single();

    type NewPostRow = { id: string };
    const typedPost = newPost as NewPostRow | null;

    if (error) {
      console.error("Failed to create post:", error);
      alert(`Failed to create post: ${error.message}`);
      setPosting(false);
      return;
    }

    // Handle mentions (non-blocking)
    if (typedPost?.id && content) {
      console.log("💬 About to call handlePostMentions for post:", typedPost.id);
      handlePostMentions(typedPost.id, content, currentUserId).catch((err: any) => {
        console.error("Failed to create mention notifications:", err);
      });
    } else {
      console.log("⚠️ Skipping handlePostMentions - typedPost.id:", typedPost?.id, "content:", content);
    }

    // Notify followers about new post (non-blocking)
    if (typedPost?.id) {
      (async () => {
        try {
          // Fetch all followers
          const { data: followers } = await supabase
            .from("follows")
            .select("follower_id")
            .eq("following_id", currentUserId);

          if (followers && followers.length > 0) {
            type FollowerRow = { follower_id: string };
            const typedFollowers = followers as FollowerRow[];

            // Create notifications for all followers
            const notifications = typedFollowers.map((follower) => ({
              user_id: follower.follower_id,
              actor_id: currentUserId,
              type: "new_post" as const,
              entity_type: "post",
              entity_id: typedPost.id,
              is_read: false,
            }));

            const { error: notifError } = await supabase
              .from("notifications")
              .insert(notifications as any);

            if (notifError) {
              console.error("Failed to create follower notifications:", notifError);
            }
          }
        } catch (err) {
          console.error("Failed to notify followers:", err);
        }
      })();
    }

    console.log("Post created successfully");
    setContent("");
    setPosting(false);
    loadPosts();
  };

  /* ---------------- LIKE ---------------- */

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!currentUserId) return;

    // Find the post author
    const post = posts.find((p) => p.id === postId);
    const postAuthorId = post?.user_id;

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

      // Create like notification (non-blocking, exclude self-likes)
      if (postAuthorId && postAuthorId !== currentUserId) {
        (async () => {
          try {
            const { error } = await supabase.from("notifications").insert({
              user_id: postAuthorId,
              actor_id: currentUserId,
              type: "like",
              entity_type: "post",
              entity_id: postId,
              is_read: false,
            } as any);

            if (error) {
              console.error("Failed to create like notification:", error);
            }
          } catch (err) {
            console.error("Failed to create like notification:", err);
          }
        })();
      }
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
