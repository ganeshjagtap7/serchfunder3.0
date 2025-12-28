"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { SavedPost } from "./types";

interface SavedPostCardProps {
  savedPost: SavedPost;
  currentUserId: string;
  onUnsave: (savedPostId: string) => void;
  onLike: (postId: string, isLiked: boolean) => void;
}

export default function SavedPostCard({
  savedPost,
  currentUserId,
  onUnsave,
  onLike,
}: SavedPostCardProps) {
  const [isUnsaving, setIsUnsaving] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const post = savedPost.posts;
  const author = post.profiles;

  const handleUnsave = async () => {
    if (isUnsaving) return;

    setIsUnsaving(true);

    // Optimistically update UI
    onUnsave(savedPost.id);

    // Delete from database
    const { error } = await supabase
      .from("saved_posts")
      .delete()
      .eq("id", savedPost.id);

    if (error) {
      console.error("Error unsaving post:", error);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    const wasLiked = savedPost.is_liked;
    const postAuthorId = post.user_id;

    // Optimistically update UI
    onLike(post.id, wasLiked);

    try {
      if (wasLiked) {
        // Unlike
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", currentUserId);
      } else {
        // Like
        await supabase.from("likes").insert({
          post_id: post.id,
          user_id: currentUserId,
        } as never);

        // Create like notification (non-blocking, exclude self-likes)
        if (postAuthorId && postAuthorId !== currentUserId) {
          (async () => {
            try {
              const { error } = await supabase.from("notifications").insert({
                user_id: postAuthorId,
                actor_id: currentUserId,
                type: "like",
                entity_type: "post",
                entity_id: post.id,
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
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update
      onLike(post.id, !wasLiked);
    } finally {
      setIsLiking(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          <div
            className="size-12 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-700"
            style={{
              backgroundImage: author?.avatar_url
                ? `url('${author.avatar_url}')`
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between items-start">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <h3 className="text-[#0d121b] font-bold text-base hover:underline cursor-pointer">
                {author?.full_name ?? "Unknown User"}
              </h3>
              <span className="text-[#4c669a] text-sm">
                @{author?.username ?? author?.id?.slice(0, 8) ?? "user"}
              </span>
              <span className="text-[#4c669a] text-sm hidden sm:inline">
                •
              </span>
              <span className="text-[#4c669a] text-sm hover:underline cursor-pointer">
                {formatTimestamp(post.created_at)}
              </span>
            </div>

            {/* Unsave Button */}
            <button
              onClick={handleUnsave}
              disabled={isUnsaving}
              className="group flex items-center justify-center p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 -mt-2 -mr-2 transition-colors"
              title="Unsave Post"
            >
              <span className="material-symbols-outlined text-primary filled text-[24px] group-hover:text-red-500 transition-colors">
                bookmark
              </span>
            </button>
          </div>

          {/* Post Content */}
          <div className="mt-2 text-[#0d121b] text-[15px] leading-relaxed">
            {post.content}
          </div>

          {/* Image Preview */}
          {post.image_url && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url('${post.image_url}')` }}
              />
            </div>
          )}

          {/* GIF Preview */}
          {post.gif_url && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url('${post.gif_url}')` }}
              />
            </div>
          )}

          {/* Reaction Bar */}
          <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-6">
              {/* Like */}
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-1.5 text-[#4c669a] hover:text-primary transition-colors group"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                  favorite
                </span>
                <span className="text-xs font-semibold">{savedPost.like_count}</span>
              </button>

              {/* Comment */}
              <Link
                href={`/posts/${post.id}`}
                className="flex items-center gap-1.5 text-[#4c669a] hover:text-primary transition-colors group"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                  chat_bubble
                </span>
                <span className="text-xs font-semibold">{savedPost.comment_count}</span>
              </Link>

              {/* Share */}
              <button className="flex items-center gap-1.5 text-[#4c669a] hover:text-primary transition-colors group">
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                  ios_share
                </span>
                <span className="text-xs font-semibold">{savedPost.share_count}</span>
              </button>
            </div>

            {/* View Original */}
            <Link
              href={`/posts/${post.id}`}
              className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
            >
              View Original
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
