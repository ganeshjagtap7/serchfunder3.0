"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/types/database";
import PostCard from "@/app/components/dashboard/PostCard";

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
  is_pinned?: boolean;
  profiles: Profile | null;
  likes: { user_id: string }[];
  comments: { count: number }[];
};

interface ProfileFeedProps {
  userId: string;
  currentUserId: string | null;
  activeTab: string;
  refreshTrigger?: number; // Optional prop to trigger refresh
}

export default function ProfileFeed({ userId, currentUserId, activeTab, refreshTrigger }: ProfileFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [userId, activeTab, refreshTrigger]);

  const loadPosts = async () => {
    setLoading(true);

    if (activeTab === "posts") {
      // Load user's own posts
      const { data, error } = await supabase
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
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading posts:", error);
      }

      setPosts((data as Post[]) || []);
    } else if (activeTab === "likes") {
      // Load posts the user has liked
      const { data: likedPostsData, error } = await supabase
        .from("likes")
        .select(`
          post_id,
          posts (
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
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading liked posts:", error);
      }

      // Extract posts from the nested structure
      const likedPosts = (likedPostsData || [])
        .map((item: any) => item.posts)
        .filter(Boolean) as Post[];

      setPosts(likedPosts);
    } else {
      // Other tabs not yet implemented
      setPosts([]);
    }

    setLoading(false);
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!currentUserId) return;

    // Find the post author
    const post = posts.find((p) => p.id === postId);
    const postAuthorId = post?.user_id;

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

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  if (activeTab !== "posts" && activeTab !== "likes") {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">This tab is not yet implemented.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">
          {activeTab === "posts" ? "No posts yet." : "No liked posts yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border-b border-slate-200 p-4 hover:bg-slate-50 cursor-pointer transition"
        >
          <PostCard
            post={post}
            currentUserId={currentUserId}
            onLike={handleLike}
          />
        </div>
      ))}
    </div>
  );
}
