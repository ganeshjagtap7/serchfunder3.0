"use client";

import { useState } from "react";

interface NotificationsSidebarProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

export default function NotificationsSidebar({ filter, onFilterChange }: NotificationsSidebarProps) {
  const [segmentFilter, setSegmentFilter] = useState("all");

  const handleSegmentChange = (value: string) => {
    setSegmentFilter(value);
    onFilterChange(value.toLowerCase());
  };

  return (
    <div className="sticky top-24">
      <div className="flex flex-col gap-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 text-lg font-bold leading-normal">Notifications</h1>
        </div>

        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-background-light p-1">
          <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 ${
            segmentFilter === "all"
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-500"
          } text-sm font-medium leading-normal`}>
            <span className="truncate">All</span>
            <input
              className="invisible w-0"
              name="notif-filter"
              type="radio"
              value="all"
              checked={segmentFilter === "all"}
              onChange={() => handleSegmentChange("all")}
            />
          </label>
          <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 ${
            segmentFilter === "verified"
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-500"
          } text-sm font-medium leading-normal`}>
            <span className="truncate">Verified</span>
            <input
              className="invisible w-0"
              name="notif-filter"
              type="radio"
              value="verified"
              checked={segmentFilter === "verified"}
              onChange={() => handleSegmentChange("verified")}
            />
          </label>
          <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 ${
            segmentFilter === "mentions"
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-500"
          } text-sm font-medium leading-normal`}>
            <span className="truncate">Mentions</span>
            <input
              className="invisible w-0"
              name="notif-filter"
              type="radio"
              value="mentions"
              checked={segmentFilter === "mentions"}
              onChange={() => handleSegmentChange("mentions")}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1 -mx-2 mt-2">
          <button
            onClick={() => onFilterChange("all")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              filter === "all"
                ? "bg-primary/10 text-primary"
                : "hover:bg-slate-100 text-slate-900"
            }`}
          >
            <span className={`material-symbols-${filter === "all" ? "filled" : "outlined"} text-xl`}>
              notifications
            </span>
            <p className="text-sm font-medium leading-normal">All Notifications</p>
          </button>

          <button
            onClick={() => onFilterChange("mention")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              filter === "mention"
                ? "bg-primary/10 text-primary"
                : "hover:bg-slate-100 text-slate-900"
            }`}
          >
            <span className="material-symbols-outlined text-xl">alternate_email</span>
            <p className="text-sm font-medium leading-normal">Mentions</p>
          </button>

          <button
            onClick={() => onFilterChange("like")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              filter === "like"
                ? "bg-primary/10 text-primary"
                : "hover:bg-slate-100 text-slate-900"
            }`}
          >
            <span className="material-symbols-outlined text-xl">favorite</span>
            <p className="text-sm font-medium leading-normal">Likes</p>
          </button>

          <button
            onClick={() => onFilterChange("reply")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              filter === "reply"
                ? "bg-primary/10 text-primary"
                : "hover:bg-slate-100 text-slate-900"
            }`}
          >
            <span className="material-symbols-outlined text-xl">chat_bubble</span>
            <p className="text-sm font-medium leading-normal">Replies</p>
          </button>

          <button
            onClick={() => onFilterChange("follow")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              filter === "follow"
                ? "bg-primary/10 text-primary"
                : "hover:bg-slate-100 text-slate-900"
            }`}
          >
            <span className="material-symbols-outlined text-xl">person_add</span>
            <p className="text-sm font-medium leading-normal">New Followers</p>
          </button>
        </div>
      </div>
    </div>
  );
}
