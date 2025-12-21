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
}

export default function ProfileFeed({ userId, currentUserId, activeTab }: ProfileFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [userId, activeTab]);

  const loadPosts = async () => {
    setLoading(true);

    if (activeTab !== "posts") {
      setPosts([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("posts")
      .select(`
        id,
        user_id,
        content,
        created_at,
        is_pinned,
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

    const sortedPosts = (data as Post[]) || [];
    const pinned = sortedPosts.filter(p => p.is_pinned);
    const regular = sortedPosts.filter(p => !p.is_pinned);

    setPosts([...pinned, ...regular]);
    setLoading(false);
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!currentUserId) return;

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

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-sm text-slate-500">Loading posts…</p>
      </div>
    );
  }

  if (activeTab !== "posts") {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">This tab is not yet implemented.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="border-b border-slate-200 p-4 hover:bg-slate-50 cursor-pointer transition"
        >
          {post.is_pinned && (
            <div className="flex gap-2 text-xs text-slate-500 font-bold mb-1 ml-10">
              <span className="material-symbols-outlined text-sm font-bold">push_pin</span>
              Pinned Post
            </div>
          )}
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
