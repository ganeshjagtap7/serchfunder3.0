"use client";

import Link from "next/link";
import { Avatar } from "@/app/components/ui/Avatar";
import { VerifiedBadge } from "@/app/components/ui/VerifiedBadge";

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
  created_at: string;
  profiles: PostProfile | null;
  likes: { user_id: string }[];
  comments: { count: number }[];
}

interface PostCardProps {
  post: Post;
  currentUserId: string | null;
  onLike: (postId: string, isLiked: boolean) => void;
}

export default function PostCard({ post, currentUserId, onLike }: PostCardProps) {
  const author = post.profiles;
  const isLiked = post.likes.some((l) => l.user_id === currentUserId);

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
            <span className="material-symbols-outlined text-slate-400">
              more_horiz
            </span>
          </div>

          <p className="mt-1 whitespace-pre-wrap text-slate-900">
            {post.content}
          </p>

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
