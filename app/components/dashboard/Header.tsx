"use client";

import Link from "next/link";

interface HeaderProps {
  avatarUrl?: string;
}

export default function Header({ avatarUrl }: HeaderProps) {
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
        <Link href="/dashboard" className="flex flex-col items-center text-slate-500 gap-0.5 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-xs">Feed</span>
        </Link>
        <Link href="/explore" className="flex flex-col items-center text-slate-500 gap-0.5 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-2xl">search</span>
          <span className="text-xs">Explore</span>
        </Link>
        <Link href="/connect" className="flex flex-col items-center text-slate-500 gap-0.5 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-2xl">group</span>
          <span className="text-xs">Connect</span>
        </Link>
        <Link href="/notifications" className="flex flex-col items-center text-slate-500 gap-0.5 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="text-xs">Notifications</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-slate-500 gap-0.5 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-xs">Profile</span>
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        {avatarUrl && (
          <div className="size-10 rounded-full overflow-hidden">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        )}
        <button className="bg-primary text-white rounded-full px-5 py-2 text-sm font-bold hover:bg-primary/90 transition-colors">
          Post
        </button>
      </div>
    </header>
  );
}
