"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DynamicHeader from "@/app/components/dashboard/DynamicHeader";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import ProfileTabs from "@/app/components/profile/ProfileTabs";
import ProfileFeed from "@/app/components/profile/ProfileFeed";
import ProfileRightSidebar from "@/app/components/profile/ProfileRightSidebar";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  role: string;
  bio: string | null;
  is_verified: boolean;
  location: string | null;
  website: string | null;
  created_at: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setCurrentUserId(user.id);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, banner_url, role, bio, is_verified, location, website, created_at")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData as Profile);
    }

    setLoading(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile({});
    } else {
      setEditedProfile({
        bio: profile?.bio || "",
        location: profile?.location || "",
        website: profile?.website || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!currentUserId) return;

    const { error } = await supabase
      .from("profiles")
      .update(editedProfile as never)
      .eq("id", currentUserId);

    if (!error) {
      setProfile({ ...profile!, ...editedProfile });
      setIsEditing(false);
      setEditedProfile({});
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!currentUserId) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${currentUserId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl } as never)
      .eq("id", currentUserId);

    if (!updateError) {
      setProfile({ ...profile!, avatar_url: publicUrl });
    }
  };

  const handleBannerUpload = async (file: File) => {
    if (!currentUserId) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${currentUserId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("banners")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("banners")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ banner_url: publicUrl } as never)
      .eq("id", currentUserId);

    if (!updateError) {
      setProfile({ ...profile!, banner_url: publicUrl });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f6f6f8" }}>
        <DynamicHeader />
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-slate-500">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f6f6f8" }}>
        <DynamicHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h1>
            <p className="text-slate-500">Please complete your profile setup.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f6f6f8" }}>
      <DynamicHeader avatarUrl={profile.avatar_url ?? undefined} />

      <main className="flex h-full grow flex-col items-center">
        <div className="w-full max-w-7xl px-0 sm:px-6 lg:px-8 py-0 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex flex-col w-full lg:w-[65%] bg-white border-x border-slate-200 min-h-screen sm:rounded-xl overflow-hidden shadow-sm">
              <ProfileHeader
                profile={profile}
                isFollowing={false}
                currentUserId={currentUserId}
                onFollowChange={() => {}}
                isEditing={isEditing}
                editedProfile={editedProfile}
                onEditToggle={handleEditToggle}
                onSaveProfile={handleSaveProfile}
                onEditChange={setEditedProfile}
                onAvatarUpload={handleAvatarUpload}
                onBannerUpload={handleBannerUpload}
              />

              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

              <ProfileFeed
                userId={profile.id}
                currentUserId={currentUserId}
                activeTab={activeTab}
                refreshTrigger={refreshTrigger}
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
