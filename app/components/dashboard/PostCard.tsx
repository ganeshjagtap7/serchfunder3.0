"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/app/components/ui/Avatar";
import { VerifiedBadge } from "@/app/components/ui/VerifiedBadge";
import { supabase } from "@/lib/supabaseClient";

interface PostProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified?: boolean;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  gif_url?: string | null;
  created_at: string;
  profiles: PostProfile | null;
  likes: { user_id: string }[];
  comments: { count: number }[];
}

interface PostCardProps {
  post: Post;
  currentUserId: string | null;
  onLike: (postId: string, isLiked: boolean) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

export default function PostCard({ post, currentUserId, onLike, onDelete, onEdit, onSave }: PostCardProps) {
  const author = post.profiles;
  const isLiked = post.likes.some((l) => l.user_id === currentUserId);
  const isOwnPost = currentUserId === post.user_id;

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } else {
      setShowMenu(false);
      if (onDelete) onDelete(post.id);
    }
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("saved_posts")
      .insert({
        user_id: currentUserId,
        post_id: post.id,
      } as never);

    if (error) {
      if (error.code === "23505") {
        alert("Post already saved!");
      } else {
        console.error("Error saving post:", error);
        alert("Failed to save post. Please try again.");
      }
    } else {
      alert("Post saved successfully!");
      setShowMenu(false);
      if (onSave) onSave(post.id);
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) onEdit(post.id);
  };

  return (
    <div className="flex gap-3">
        <Avatar
          src={author?.avatar_url ?? undefined}
          fallback={author?.full_name?.[0] ?? "?"}
        />

        <div className="flex-1">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Link
                href={`/users/${post.user_id}`}
                className="font-bold text-slate-900 hover:underline"
              >
                {author?.full_name ?? "Unknown"}
              </Link>
              {author?.is_verified && <VerifiedBadge />}
              <span className="text-slate-500 text-sm">
                · {new Date(post.created_at).toLocaleTimeString()}
              </span>
            </div>

            {/* Three-dot menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Post options"
              >
                <span className="material-symbols-outlined text-slate-400">
                  more_horiz
                </span>
              </button>

              {/* Dropdown menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                  {isOwnPost && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit post
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                        Delete post
                      </button>
                      <div className="border-t border-slate-200 my-1"></div>
                    </>
                  )}
                  <button
                    onClick={handleSave}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">bookmark</span>
                    Save post
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mt-1 whitespace-pre-wrap text-slate-900">
            {post.content}
          </p>

          {/* Image Display */}
          {post.image_url && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
              <img
                src={post.image_url}
                alt="Post image"
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* GIF Display */}
          {post.gif_url && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
              <img
                src={post.gif_url}
                alt="Post GIF"
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          <div className="flex gap-6 mt-3 text-slate-400">
            {/* Like Button - Twitter/X style */}
            <button
              onClick={() => onLike(post.id, isLiked)}
              className={`flex items-center gap-1 transition-all duration-200 cursor-pointer group ${
                isLiked
                  ? "text-red-500"
                  : "text-slate-400 hover:text-red-500"
              }`}
              aria-label={isLiked ? "Unlike post" : "Like post"}
              aria-pressed={isLiked}
            >
              <span
                className={isLiked ? "material-symbols-filled" : "material-symbols-outlined"}
                style={{ fontSize: "20px" }}
              >
                favorite
              </span>
              <span className="text-sm">{post.likes.length}</span>
            </button>

            {/* Comment Button - Navigate to post detail */}
            <Link
              href={`/posts/${post.id}`}
              className="flex items-center gap-1 transition-all duration-200 cursor-pointer group text-slate-400 hover:text-blue-500"
              aria-label="Comment on post"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                chat_bubble
              </span>
              <span className="text-sm">{post.comments?.[0]?.count ?? 0}</span>
            </Link>
          </div>
        </div>
      </div>
  );
}
