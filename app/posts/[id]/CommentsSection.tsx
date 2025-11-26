"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
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
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setComments(data || []);
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
      })
      .select("*")
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setComments((prev) => [...prev, data]);
      setContent("");
    }

    setPosting(false);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Comments</h2>

      <form onSubmit={handleAddComment} className="space-y-2">
        <textarea
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          rows={3}
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={posting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {posting ? "Posting..." : "Add comment"}
        </button>
      </form>

      <div className="space-y-3 border-t border-slate-800 pt-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-400">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="rounded-md bg-slate-900 border border-slate-800 p-3"
            >
              <p className="text-sm text-slate-100 whitespace-pre-wrap">
                {c.content}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
