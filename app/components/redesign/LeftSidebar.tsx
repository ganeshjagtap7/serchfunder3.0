"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar } from "@/app/components/ui/Avatar";
import Link from "next/link";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  is_verified?: boolean;
};

export default function LeftSidebar() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role, bio, is_verified")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    };

    loadProfile();
  }, []);

  return (
    <aside className="hidden md:block md:col-span-3 space-y-6">
      {/* Profile Card */}
      <div className="card-dark rounded-xl overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="h-24 bg-primary/10 w-full relative">
          <div className="absolute -bottom-10 left-4 p-1 bg-white dark:bg-slate-900 rounded-full">
            <Avatar
              src={profile?.avatar_url ?? undefined}
              fallback={profile?.full_name?.[0] ?? "?"}
              className="w-20 h-20"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-12 px-5 pb-5">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {profile?.full_name ?? "Loading..."}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            @{profile?.full_name?.toLowerCase().replace(/\s+/g, '_') ?? 'user'}_investor
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
            {profile?.role === 'searcher' && 'Active Searcher | MBA | Looking for B2B SaaS in the Midwest.'}
            {profile?.role === 'investor' && 'Active Investor | Looking for opportunities'}
            {profile?.role === 'broker' && 'Business Broker | Deal flow specialist'}
            {profile?.role === 'seller' && 'Business Owner | Exploring exit options'}
            {!profile && 'Active Searcher | MBA | Looking for B2B SaaS in the Midwest.'}
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">420</span>
              {" "}
              <span className="text-slate-500">Following</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">892</span>
              {" "}
              <span className="text-slate-500">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Card */}
      <div className="card-dark rounded-xl p-2 shadow-sm">
        <nav className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary font-medium"
          >
            <span className="material-symbols-outlined">rss_feed</span>
            Latest Activity
          </Link>
          <Link
            href="/posts/saved"
            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
          >
            <span className="material-symbols-outlined">bookmark</span>
            Saved Posts
          </Link>
          <Link
            href="/groups"
            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
          >
            <span className="material-symbols-outlined">group</span>
            My Communities
          </Link>
          <Link
            href="/deals"
            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
          >
            <span className="material-symbols-outlined">trending_up</span>
            Deal Flow
          </Link>
        </nav>
      </div>
    </aside>
  );
}
