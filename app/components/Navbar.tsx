"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export default function Navbar() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (data) setProfile(data as Profile);
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const initial =
    profile?.full_name?.charAt(0).toUpperCase() ??
    (profile?.id ? profile.id.charAt(0).toUpperCase() : "U");

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard">
        <h1 className="text-xl font-bold text-white cursor-pointer">
          Searchfunder 2.0
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/profile" className="flex items-center gap-2">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover border border-slate-700"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-100">
              {initial}
            </div>
          )}
          <span className="px-3 py-1 text-sm rounded-md bg-slate-800 hover:bg-slate-700 text-white">
            Profile
          </span>
        </Link>
        <Link
  href="/groups"
  className="px-3 py-1 text-sm rounded-md bg-slate-800 hover:bg-slate-700 text-white"
>
  Groups
</Link>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-500 text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
