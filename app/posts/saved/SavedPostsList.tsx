"use client";

import { useState } from "react";
import SavedPostCard from "./SavedPostCard";
import type { SavedPost } from "./types";

interface SavedPostsListProps {
  posts: SavedPost[];
  currentUserId: string;
}

export default function SavedPostsList({
  posts: initialPosts,
  currentUserId,
}: SavedPostsListProps) {
  const [posts, setPosts] = useState(initialPosts);

  const handleUnsave = (savedPostId: string) => {
    // Optimistically update UI
    setPosts((prev) => prev.filter((p) => p.id !== savedPostId));
  };

  const handleLike = (postId: string, isLiked: boolean) => {
    // Optimistically update like status
    setPosts((prev) =>
      prev.map((p) => {
        if (p.post_id === postId) {
          return {
            ...p,
            is_liked: !isLiked,
            like_count: isLiked ? p.like_count - 1 : p.like_count + 1,
          };
        }
        return p;
      })
    );
  };

  // Check if there are no saved posts
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">
          bookmark_border
        </span>
        <h2 className="text-2xl font-bold text-[#0d121b] mb-2">
          No saved posts yet
        </h2>
        <p className="text-[#4c669a] text-center">
          When you save posts, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((savedPost) => (
        <SavedPostCard
          key={savedPost.id}
          savedPost={savedPost}
          currentUserId={currentUserId}
          onUnsave={handleUnsave}
          onLike={handleLike}
        />
      ))}
    </div>
  );
}
