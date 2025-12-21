"use client";

import { Avatar } from "@/app/components/ui/Avatar";
import { VerifiedBadge } from "@/app/components/ui/VerifiedBadge";
import { supabase } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
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
}

export default function ProfileHeader({ profile, isFollowing, currentUserId, onFollowChange }: ProfileHeaderProps) {
  const isOwnProfile = currentUserId === profile.id;

  const handleFollow = async () => {
    if (!currentUserId || isOwnProfile) return;

    // TODO: Implement follow logic with Supabase
    onFollowChange(!isFollowing);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <div className="relative w-full">
        <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="absolute top-20 sm:top-32 left-4">
          <div className="size-24 sm:size-32 border-4 border-white rounded-full overflow-hidden bg-slate-200">
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
          </div>
        </div>
        <div className="flex justify-end px-4 py-3 gap-2">
          <button className="size-9 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition">
            <span className="material-symbols-outlined text-xl">more_horiz</span>
          </button>
          <button className="size-9 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition">
            <span className="material-symbols-outlined text-xl">mail</span>
          </button>
          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              className="bg-primary hover:bg-blue-700 text-white rounded-full px-5 py-1.5 font-bold text-sm transition"
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
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

        {profile.bio && (
          <p className="mt-3 text-slate-900 text-sm leading-normal">
            {profile.bio}
          </p>
        )}

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
      </div>
    </>
  );
}
