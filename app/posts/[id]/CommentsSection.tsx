"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Avatar } from "@/app/components/ui/Avatar";
import { VerifiedBadge } from "@/app/components/ui/VerifiedBadge";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: Profile | null;
};

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url,
          is_verified
        )
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setComments((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setPosting(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to comment.");
      setPosting(false);
      return;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content,
      } as any)
      .select("*")
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      // Reload to get profile info
      loadComments();
      setContent("");
    }

    setPosting(false);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Comments</h2>

      <form onSubmit={handleAddComment} className="space-y-2">
        <textarea
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          rows={3}
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={posting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {posting ? "Posting..." : "Add comment"}
        </button>
      </form>

      <div className="space-y-3 border-t border-border pt-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((c) => {
            const authorName = c.profiles?.full_name || `User ${c.user_id.slice(0, 6)}`;
            const authorAvatar = c.profiles?.avatar_url;
            const authorInitial = authorName.charAt(0).toUpperCase();

            return (
              <div
                key={c.id}
                className="rounded-md bg-card border border-border p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar src={authorAvatar} fallback={authorInitial} className="h-6 w-6 text-xs" />
                  <Link href={`/users/${c.user_id}`} className="text-xs font-semibold text-foreground hover:underline">
                    {authorName}
                  </Link>
                  {c.profiles?.is_verified && <VerifiedBadge className="h-3 w-3" />}
                  <span className="text-xs text-muted-foreground">
                    • {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap pl-8">
                  {c.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
