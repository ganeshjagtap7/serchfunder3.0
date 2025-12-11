"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";

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
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Searchfunder
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1">
              <Link href="/groups">
                <Button variant="ghost" size="sm">Groups</Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="sm">Messages</Button>
              </Link>
            </div>

            <div className="h-6 w-px bg-border hidden md:block" />

            <Link href="/profile" className="flex items-center gap-2 group">
              <Avatar
                src={profile?.avatar_url}
                fallback={initial}
                className="border-2 border-transparent group-hover:border-primary transition-colors"
              />
              <span className="hidden md:block text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Profile
              </span>
            </Link>

            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
