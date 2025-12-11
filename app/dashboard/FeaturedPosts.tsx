"use client";

import { useEffect, useState } from "react";
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

type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: Profile | null;
  likes: { user_id: string }[];
};

export default function FeaturedPosts() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedPosts = async () => {
      setLoading(true);

      // Get posts with most likes (featured posts)
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            id,
            full_name,
            avatar_url,
            is_verified
          ),
          likes (
            user_id
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error loading featured posts:", error);
      } else {
        // Sort by number of likes (most liked first)
        const sorted = (data as any[] || []).sort((a, b) => {
          const aLikes = a.likes?.length || 0;
          const bLikes = b.likes?.length || 0;
          return bLikes - aLikes;
        });
        setFeaturedPosts(sorted.slice(0, 3)); // Top 3 featured posts
      }

      setLoading(false);
    };

    loadFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Featured Posts</h2>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (featuredPosts.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Featured Posts</h2>
        <p className="text-sm text-muted-foreground">No featured posts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Featured Posts</h2>
      <div className="space-y-4">
        {featuredPosts.map((post) => {
          const likeCount = post.likes?.length || 0;
          const authorName = post.profiles?.full_name || `User ${post.user_id.slice(0, 6)}`;
          const authorAvatar = post.profiles?.avatar_url;
          const authorInitial = authorName.charAt(0).toUpperCase();
          const contentPreview = post.content.length > 100 
            ? post.content.substring(0, 100) + "..." 
            : post.content;

          return (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block rounded-lg border border-border bg-card p-4 space-y-3 hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2">
                <Avatar src={authorAvatar} fallback={authorInitial} className="h-8 w-8 text-xs" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {authorName}
                    </span>
                    {post.profiles?.is_verified && <VerifiedBadge className="h-3 w-3 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-foreground line-clamp-3">
                {contentPreview}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>❤️ {likeCount} likes</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
