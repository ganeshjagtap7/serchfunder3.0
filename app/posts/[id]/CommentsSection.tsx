"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Avatar } from "@/app/components/ui/Avatar";
import { VerifiedBadge } from "@/app/components/ui/VerifiedBadge";
import { extractMentions } from "@/lib/mentions";

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

  const handleCommentMentions = async (commentId: string, content: string, authorId: string) => {
    try {
      const mentions = extractMentions(content);
      if (mentions.length === 0) return;

      // Resolve usernames to user IDs
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("username", mentions);

      type ProfileRow = { id: string; username: string | null };
      const typedProfiles = (profiles || []) as ProfileRow[];

      if (typedProfiles.length === 0) return;

      // Create mention notifications (excluding self-mentions)
      const notifications = typedProfiles
        .filter((profile) => profile.id !== authorId)
        .map((profile) => ({
          user_id: profile.id,
          actor_id: authorId,
          type: "mention" as const,
          entity_type: "comment",
          entity_id: commentId,
          is_read: false,
        }));

      if (notifications.length > 0) {
        await supabase.from("notifications").insert(notifications as any);
      }
    } catch (error) {
      console.error("Error creating mention notifications:", error);
    }
  };

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
      .select("id")
      .single();

    type NewCommentRow = { id: string };
    const typedComment = data as NewCommentRow | null;

    if (error) {
      setError(error.message);
    } else if (typedComment) {
      // Handle mentions (non-blocking)
      if (typedComment.id && content) {
        handleCommentMentions(typedComment.id, content, user.id).catch((err: any) => {
          console.error("Failed to create mention notifications:", err);
        });
      }

      // Create reply notification (non-blocking)
      if (typedComment.id) {
        (async () => {
          try {
            // Fetch post author
            const { data: post } = await supabase
              .from("posts")
              .select("user_id")
              .eq("id", postId)
              .single();

            type PostRow = { user_id: string };
            const typedPost = post as PostRow | null;
            const postAuthorId = typedPost?.user_id;

            // Create notification (exclude self-replies)
            if (postAuthorId && postAuthorId !== user.id) {
              const { error: notifError } = await supabase
                .from("notifications")
                .insert({
                  user_id: postAuthorId,
                  actor_id: user.id,
                  type: "reply",
                  entity_type: "post",
                  entity_id: postId,
                  is_read: false,
                } as any);

              if (notifError) {
                console.error("Failed to create reply notification:", notifError);
              }
            }
          } catch (err) {
            console.error("Failed to create reply notification:", err);
          }
        })();
      }

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
