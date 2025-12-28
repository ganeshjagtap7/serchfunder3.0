"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/app/components/dashboard/Header";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import ProfileTabs from "@/app/components/profile/ProfileTabs";
import ProfileFeed from "@/app/components/profile/ProfileFeed";
import ProfileRightSidebar from "@/app/components/profile/ProfileRightSidebar";

type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  role: string;
  bio: string | null;
  is_verified: boolean;
  location: string | null;
  website: string | null;
  linkedin_url: string | null;
  education: string | null;
  work: string | null;
  created_at: string;
};

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);

    if (user) {
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      setCurrentUserAvatar((currentProfile as any)?.avatar_url || null);
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url, banner_url, role, bio, is_verified, location, website, linkedin_url, education, work, created_at")
      .eq("id", userId)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f6f6f8' }}>
        <Header avatarUrl={currentUserAvatar ?? undefined} />
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-slate-500">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f6f6f8' }}>
        <Header avatarUrl={currentUserAvatar ?? undefined} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">User not found</h1>
            <p className="text-slate-500">This profile does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f8' }}>
      <Header avatarUrl={currentUserAvatar ?? undefined} />

      <main className="flex h-full grow flex-col items-center">
        <div className="w-full max-w-7xl px-0 sm:px-6 lg:px-8 py-0 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex flex-col w-full lg:w-[65%] bg-white border-x border-slate-200 min-h-screen sm:rounded-xl overflow-hidden shadow-sm">
              <ProfileHeader
                profile={profile}
                isFollowing={isFollowing}
                currentUserId={currentUserId}
                onFollowChange={setIsFollowing}
              />

              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

              <ProfileFeed
                userId={userId}
                currentUserId={currentUserId}
                activeTab={activeTab}
              />
            </div>

            <div className="hidden lg:flex flex-col gap-6 w-[35%]">
              <ProfileRightSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
