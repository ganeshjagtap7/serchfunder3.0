"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/app/components/ui/Avatar";
import { VerifiedBadge } from "@/app/components/ui/VerifiedBadge";
import { supabase } from "@/lib/supabaseClient";

interface Profile {
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
}

interface ProfileHeaderProps {
  profile: Profile;
  isFollowing: boolean;
  currentUserId: string | null;
  onFollowChange: (following: boolean) => void;
  isEditing?: boolean;
  editedProfile?: Partial<Profile>;
  onEditToggle?: () => void;
  onSaveProfile?: () => void;
  onEditChange?: (profile: Partial<Profile>) => void;
  onAvatarUpload?: (file: File) => void;
  onBannerUpload?: (file: File) => void;
}

export default function ProfileHeader({
  profile,
  isFollowing,
  currentUserId,
  onFollowChange,
  isEditing = false,
  editedProfile = {},
  onEditToggle,
  onSaveProfile,
  onEditChange,
  onAvatarUpload,
  onBannerUpload
}: ProfileHeaderProps) {
  const isOwnProfile = currentUserId === profile.id;
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  const handleFollow = async () => {
    if (!currentUserId || isOwnProfile) return;

    if (isFollowing) {
      // Unfollow
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profile.id);

      onFollowChange(false);
    } else {
      // Follow
      await supabase.from("follows").insert({
        follower_id: currentUserId,
        following_id: profile.id,
      } as never);

      onFollowChange(true);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleBannerClick = () => {
    if (isEditing && bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarUpload) {
      setAvatarUploading(true);
      await onAvatarUpload(file);
      setAvatarUploading(false);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onBannerUpload) {
      setBannerUploading(true);
      await onBannerUpload(file);
      setBannerUploading(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <div className="relative w-full">
        {/* Banner */}
        <div
          className={`h-32 sm:h-48 w-full relative group ${isEditing ? "cursor-pointer" : ""}`}
          onClick={handleBannerClick}
        >
          {profile.banner_url ? (
            <img
              src={profile.banner_url}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          )}
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {bannerUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                <span className="material-symbols-outlined text-white text-4xl">photo_camera</span>
              )}
            </div>
          )}
        </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBannerChange}
        />

        {/* Avatar */}
        <div className="absolute top-20 sm:top-32 left-4">
          <div
            className={`size-24 sm:size-32 border-4 border-white rounded-full overflow-hidden bg-slate-200 relative group ${isEditing ? "cursor-pointer" : ""}`}
            onClick={handleAvatarClick}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || "User avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600 font-bold text-4xl uppercase">
                {profile.full_name?.[0] || "?"}
              </div>
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {avatarUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : (
                  <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                )}
              </div>
            )}
          </div>
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        {/* Action Buttons */}
        <div className="flex justify-end px-4 py-3 gap-2">
          {!isOwnProfile && (
            <>
              <button className="size-9 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition">
                <span className="material-symbols-outlined text-xl">more_horiz</span>
              </button>
              <button className="size-9 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition">
                <span className="material-symbols-outlined text-xl">mail</span>
              </button>
              <button
                onClick={handleFollow}
                className="bg-primary hover:bg-blue-700 text-white rounded-full px-5 py-1.5 font-bold text-sm transition"
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </>
          )}
          {isOwnProfile && !isEditing && (
            <button
              onClick={onEditToggle}
              className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-full px-5 py-1.5 font-bold text-sm transition"
            >
              Edit Profile
            </button>
          )}
          {isOwnProfile && isEditing && (
            <>
              <button
                onClick={onEditToggle}
                className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-full px-5 py-1.5 font-bold text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={onSaveProfile}
                className="bg-primary hover:bg-blue-700 text-white rounded-full px-5 py-1.5 font-bold text-sm transition"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 mt-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-bold text-slate-900">
              {profile.full_name || "Unknown User"}
            </h1>
            {profile.is_verified && <VerifiedBadge />}
          </div>
          <p className="text-slate-500 text-sm">
            @{profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'user'}
          </p>
        </div>

        {/* Bio */}
        {isEditing ? (
          <div className="mt-3">
            <textarea
              value={editedProfile.bio ?? profile.bio ?? ""}
              onChange={(e) => onEditChange?.({ ...editedProfile, bio: e.target.value })}
              className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              maxLength={160}
              placeholder="Add a bio..."
            />
            <p className="text-xs text-slate-500 mt-1 text-right">
              {(editedProfile.bio ?? profile.bio ?? "").length} / 160
            </p>
          </div>
        ) : (
          profile.bio && (
            <p className="mt-3 text-slate-900 text-sm leading-normal">
              {profile.bio}
            </p>
          )
        )}

        {/* Location and Website */}
        {isEditing ? (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-lg">location_on</span>
              <input
                type="text"
                value={editedProfile.location ?? profile.location ?? ""}
                onChange={(e) => onEditChange?.({ ...editedProfile, location: e.target.value })}
                className="flex-1 px-3 py-1.5 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Location"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-lg">link</span>
              <input
                type="url"
                value={editedProfile.website ?? profile.website ?? ""}
                onChange={(e) => onEditChange?.({ ...editedProfile, website: e.target.value })}
                className="flex-1 px-3 py-1.5 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Website"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-slate-500 text-sm">
            {profile.location && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">location_on</span>
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1 hover:text-primary transition cursor-pointer">
                <span className="material-symbols-outlined text-lg">link</span>
                <a className="hover:underline" href={profile.website} target="_blank" rel="noopener noreferrer">
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              <span>Joined {formatJoinDate(profile.created_at)}</span>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="flex gap-4 mt-3 text-sm">
            <a className="hover:underline" href="#">
              <span className="font-bold text-slate-900">0</span>{" "}
              <span className="text-slate-500">Following</span>
            </a>
            <a className="hover:underline" href="#">
              <span className="font-bold text-slate-900">0</span>{" "}
              <span className="text-slate-500">Followers</span>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
