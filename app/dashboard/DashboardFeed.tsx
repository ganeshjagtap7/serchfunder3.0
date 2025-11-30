"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Avatar } from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { Icons } from "@/app/components/ui/Icons";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);

    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        ),
        likes (
          user_id
        ),
        comments (
          count
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPosts((data as any) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to post.");
      setPosting(false);
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({ user_id: user.id, content } as any)
      .select("*")
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      // Refresh posts to get the full object with profile
      loadPosts();
      setContent("");
    }

    setPosting(false);
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!currentUserId) return;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likes: isLiked
              ? p.likes.filter((l) => l.user_id !== currentUserId)
              : [...p.likes, { user_id: currentUserId }],
          };
        }
        return p;
      })
    );

    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId);
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: currentUserId } as any);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreatePost} className="space-y-3">
        <textarea
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          rows={3}
          placeholder="Share something with the community..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={posting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </form>

      <div className="border-t border-border pt-4 space-y-4">
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts yet. Be the first!</p>
        ) : (
          posts.map((post) => {
            const isLiked = post.likes?.some((l) => l.user_id === currentUserId);
            const likeCount = post.likes?.length || 0;
            const commentCount = post.comments?.[0]?.count || 0;
            const authorName = post.profiles?.full_name || `User ${post.user_id.slice(0, 6)}`;
            const authorAvatar = post.profiles?.avatar_url;
            const authorInitial = authorName.charAt(0).toUpperCase();

            return (
              <div
                key={post.id}
                className="rounded-lg border border-border bg-card p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={authorAvatar} fallback={authorInitial} />
                  <div>
                    <Link href={`/users/${post.user_id}`} className="text-sm font-semibold text-foreground hover:underline">
                      {authorName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground"}`}
                    onClick={() => handleLike(post.id, !!isLiked)}
                  >
                    <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
                    {likeCount > 0 && <span>{likeCount}</span>}
                  </Button>

                  <Link href={`/posts/${post.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                      <Icons.MessageSquare className="h-4 w-4" />
                      {commentCount > 0 && <span>{commentCount}</span>}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
