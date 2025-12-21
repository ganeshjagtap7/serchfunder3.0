"use client";

import { FormEvent } from "react";
import { Avatar } from "@/app/components/ui/Avatar";

interface CreatePostCardProps {
  avatarUrl?: string | null;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  loading?: boolean;
}

export default function CreatePostCard({
  avatarUrl,
  value,
  onChange,
  onSubmit,
  loading = false,
}: CreatePostCardProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex gap-4">
        <Avatar
          src={avatarUrl ?? undefined}
          fallback="?"
        />

        <div className="flex-1">
          <textarea
            rows={2}
            placeholder="What's happening in your search?"
            className="w-full bg-transparent resize-none border-none focus:ring-0 text-base placeholder-slate-400 text-slate-900"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-1 text-primary">
              {["image", "gif_box", "poll", "sentiment_satisfied"].map((icon) => (
                <span
                  key={icon}
                  className="material-symbols-outlined p-2 rounded-full hover:bg-blue-50 cursor-pointer text-xl"
                >
                  {icon}
                </span>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white font-bold py-1.5 px-4 rounded-full text-sm disabled:opacity-60 hover:bg-primary/90 transition-colors"
            >
              {loading ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
