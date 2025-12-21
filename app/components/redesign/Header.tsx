"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200/80 dark:border-slate-800/80 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 md:px-10 py-3">
      {/* Logo */}
      <div className="flex items-center gap-4 text-slate-900 dark:text-white">
        <div className="size-8 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="hidden md:block text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
          Searchfunder
        </h2>
      </div>

      {/* Nav */}
      <div className="flex flex-1 justify-center md:justify-end items-center gap-8">
        <nav className="flex items-center gap-2 md:gap-6">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span className="hidden md:block text-xs font-semibold">Feed</span>
          </Link>
          <Link href="/groups" className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined">search</span>
            <span className="hidden md:block text-xs font-medium">Explore</span>
          </Link>
          <Link href="/notifications" className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="hidden md:block text-xs font-medium">Notifications</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined">person</span>
            <span className="hidden md:block text-xs font-medium">Profile</span>
          </Link>
        </nav>

        <div className="hidden md:flex gap-3 items-center ml-4 border-l border-slate-200 dark:border-slate-800 pl-4">
          <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="w-full h-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold">
              ?
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard#post")}
            className="bg-primary text-white rounded-full px-5 py-2 text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Post
          </button>
        </div>
      </div>
    </header>
  );
}
