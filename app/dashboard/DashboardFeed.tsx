"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export default function DashboardFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPosts(data || []);
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
      .insert({ user_id: user.id, content })
      .select("*")
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setPosts((prev) => [data, ...prev]);
      setContent("");
    }

    setPosting(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreatePost} className="space-y-3">
        <textarea
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          rows={3}
          placeholder="Share something with the community..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={posting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </form>

      <div className="border-t border-slate-800 pt-4 space-y-4">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-slate-400 text-sm">No posts yet. Be the first!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2"
            >
              <p className="text-sm text-slate-100 whitespace-pre-wrap">
                {post.content}
              </p>
              <p className="text-xs text-slate-500">
                {new Date(post.created_at).toLocaleString()}
              </p>
              <Link
                href={`/posts/${post.id}`}
                className="inline-block text-xs text-indigo-400 hover:text-indigo-300"
              >
                View & comment
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
