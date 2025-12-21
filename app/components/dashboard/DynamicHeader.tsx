"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface DynamicHeaderProps {
  avatarUrl?: string;
}

export default function DynamicHeader({ avatarUrl }: DynamicHeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 backdrop-blur-sm px-4 md:px-10 py-3" style={{ backgroundColor: 'rgba(246, 246, 248, 0.95)' }}>
      <div className="flex items-center gap-4 text-slate-900">
        <div className="size-8 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"/>
          </svg>
        </div>
        <h2 className="hidden md:block text-slate-900 text-lg font-bold">Searchfunder</h2>
      </div>

      <nav className="flex items-center gap-8">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            isActive("/dashboard")
              ? "text-primary"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="material-symbols-outlined text-2xl" style={isActive("/dashboard") ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          <span className={`text-xs ${isActive("/dashboard") ? "font-semibold" : ""}`}>Feed</span>
        </Link>

        <Link
          href="/explore"
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            isActive("/explore")
              ? "text-primary"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="material-symbols-outlined text-2xl" style={isActive("/explore") ? { fontVariationSettings: "'FILL' 1" } : {}}>search</span>
          <span className={`text-xs ${isActive("/explore") ? "font-semibold" : ""}`}>Explore</span>
        </Link>

        <Link
          href="/notifications"
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            isActive("/notifications")
              ? "text-primary"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="material-symbols-outlined text-2xl" style={isActive("/notifications") ? { fontVariationSettings: "'FILL' 1" } : {}}>notifications</span>
          <span className={`text-xs ${isActive("/notifications") ? "font-semibold" : ""}`}>Notifications</span>
        </Link>

        <Link
          href="/messages"
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            isActive("/messages")
              ? "text-primary"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="material-symbols-outlined text-2xl" style={isActive("/messages") ? { fontVariationSettings: "'FILL' 1" } : {}}>mail</span>
          <span className={`text-xs ${isActive("/messages") ? "font-semibold" : ""}`}>Messages</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            isActive("/profile")
              ? "text-primary"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="material-symbols-outlined text-2xl" style={isActive("/profile") ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
          <span className={`text-xs ${isActive("/profile") ? "font-semibold" : ""}`}>Profile</span>
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        {avatarUrl && (
          <div className="size-10 rounded-full overflow-hidden">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        )}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="bg-slate-100 text-slate-900 rounded-full px-5 py-2 text-sm font-bold hover:bg-slate-200 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
