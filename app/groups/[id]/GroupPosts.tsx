"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

type GroupPost = {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export default function GroupPosts({
  groupId,
  isMember,
}: {
  groupId: string;
  isMember: boolean;
}) {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("group_posts")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPosts((data as GroupPost[]) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isMember) {
      loadPosts();
    }
  }, [groupId, isMember]);

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
      .from("group_posts")
      .insert({
        group_id: groupId,
        user_id: user.id,
        content,
      })
      .select("*")
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setPosts((prev) => [data as GroupPost, ...prev]);
      setContent("");
    }

    setPosting(false);
  };

  if (!isMember) {
    return (
      <p className="text-sm text-slate-400">
        Join this group to see and create posts.
      </p>
    );
  }

  return (
    <section className="space-y-4 mt-4">
      <h2 className="text-lg font-semibold">Group posts</h2>

      <form onSubmit={handleCreatePost} className="space-y-2">
        <textarea
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          rows={3}
          placeholder="Share something with this group..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={posting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {posting ? "Posting..." : "Post in group"}
        </button>
      </form>

      <div className="space-y-3 border-t border-slate-800 pt-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-slate-400">
            No posts yet. Be the first!
          </p>
        ) : (
          posts.map((p) => (
            <div
              key={p.id}
              className="rounded-md bg-slate-900 border border-slate-800 p-3"
            >
              <p className="text-sm text-slate-100 whitespace-pre-wrap">
                {p.content}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(p.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
