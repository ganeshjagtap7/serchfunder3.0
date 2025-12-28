"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/app/components/Navbar";
import SavedPostsHeader from "./SavedPostsHeader";
import SavedPostsList from "./SavedPostsList";
import RightSidebar from "./RightSidebar";
import LeftSidebar from "./LeftSidebar";
import type { SavedPost } from "./types";

export type { SavedPost };

export default function SavedPostsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("User");
  const [posts, setPosts] = useState<SavedPost[]>([]);

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    setLoading(true);

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error in saved posts:", authError);
      router.push("/login");
      return;
    }

    setCurrentUserId(user.id);
    console.log("Current user ID:", user.id);

    // Fetch user profile for header
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, full_name")
      .eq("id", user.id)
      .single();

    setUsername((profile as any)?.username || (profile as any)?.full_name || "User");

    // Fetch saved_posts first (simpler query without joins)
    const { data: savedPostsData, error: savedError } = await supabase
      .from("saved_posts")
      .select("id, post_id, user_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    console.log("Current user ID:", user.id);
    console.log("Saved posts data:", savedPostsData);
    console.log("Number of saved posts:", savedPostsData?.length || 0);
    console.log("Saved posts error:", savedError);

    if (savedError || !savedPostsData) {
      console.error("Error fetching saved posts:", savedError);
      setPosts([]);
      setLoading(false);
      return;
    }

    // Type assertion for savedPostsData
    type SavedPostRow = { id: string; post_id: string; user_id: string; created_at: string };
    const typedSavedPosts = savedPostsData as SavedPostRow[];

    // Manually fetch each post with its profile
    const enrichedPosts = await Promise.all(
      typedSavedPosts.map(async (savedPost) => {
        // Fetch the post first
        const { data: post } = await supabase
          .from("posts")
          .select("id, user_id, content, image_url, gif_url, created_at")
          .eq("id", savedPost.post_id)
          .single();

        type PostRow = {
          id: string;
          user_id: string;
          content: string;
          image_url: string | null;
          gif_url: string | null;
          created_at: string;
        };

        if (!post) {
          return null;
        }

        const typedPost = post as PostRow;

        // Fetch the author profile separately
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, username, avatar_url, is_verified")
          .eq("id", typedPost.user_id)
          .single();

        type ProfileRow = {
          id: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          is_verified: boolean | null;
        };

        if (profileError) {
          console.error("Error fetching profile for post:", typedPost.id, profileError);
        }

        const typedProfile = profile as ProfileRow | null;

        console.log("Post:", typedPost.id, "Profile:", typedProfile);

        // Combine post with profile
        const postWithProfile = {
          ...typedPost,
          profiles: typedProfile,
        };

        // Get like count
        const { count: likeCount } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postWithProfile.id);

        // Get comment count
        const { count: commentCount } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postWithProfile.id);

        // Check if current user liked this post
        const { data: userLike } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", postWithProfile.id)
          .eq("user_id", user.id)
          .maybeSingle();

        return {
          id: savedPost.id,
          post_id: savedPost.post_id,
          user_id: savedPost.user_id,
          created_at: savedPost.created_at,
          posts: postWithProfile,
          like_count: likeCount || 0,
          comment_count: commentCount || 0,
          share_count: 0,
          is_liked: !!userLike,
        };
      })
    );

    // Filter out null values (deleted posts)
    const validPosts = enrichedPosts.filter((p): p is SavedPost => p !== null);

    console.log("Enriched posts:", enrichedPosts);
    console.log("Valid posts count:", validPosts.length);
    console.log("First post structure:", validPosts[0]);

    setPosts(validPosts);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#4c669a]">Loading saved posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8]">
      <Navbar />

      <div className="flex-1 w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-4 lg:p-6">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Feed Column */}
        <main className="md:col-span-9 lg:col-span-7 flex flex-col gap-4">
          <SavedPostsHeader username={username} />

          <SavedPostsList posts={posts} currentUserId={currentUserId || ""} />
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
