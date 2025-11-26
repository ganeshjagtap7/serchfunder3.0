"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import CommentsSection from "./CommentsSection";

type Post = {
  id: string;
  user_id: string; 
  content: string;
  created_at: string;
};

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else {
        setPost(data as Post);
      }

      setLoading(false);
    };

    if (postId) {
      loadPost();
    }
  }, [postId]);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6 space-y-4">
        {loading && <p className="text-slate-300">Loading post...</p>}

        {!loading && (error || !post) && (
          <p className="text-red-400">Post not found.</p>
        )}

        {!loading && post && (
          <>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2">
              <p className="text-sm text-slate-100 whitespace-pre-wrap">
                {post.content}
              </p>
              <p className="text-xs text-slate-500">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>

            <CommentsSection postId={post.id} />
          </>
        )}
      </main>
    </>
  );
}
