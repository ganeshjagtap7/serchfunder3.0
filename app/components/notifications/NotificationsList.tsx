"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar } from "@/app/components/ui/Avatar";
import { VerifiedBadge } from "@/app/components/ui/VerifiedBadge";

interface NotificationsListProps {
  currentUserId: string | null;
  filter: string;
}

type NotificationType = "like" | "mention" | "reply" | "follow" | "repost";

interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: NotificationType;
  entity_id: string | null;
  entity_type: string | null;
  is_read: boolean;
  created_at: string;
  metadata: any;
  actor?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    is_verified: boolean;
  };
  post?: {
    id: string;
    content: string;
  };
}

export default function NotificationsList({ currentUserId, filter }: NotificationsListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (currentUserId) {
      loadNotifications();
    }
  }, [currentUserId, filter]);

  const loadNotifications = async () => {
    if (!currentUserId) return;

    setLoading(true);

    let query = supabase
      .from("notifications")
      .select(`
        *,
        actor:actor_id(id, full_name, avatar_url, is_verified),
        post:entity_id(id, content)
      `)
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("type", filter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setNotifications(data as any);
    }

    setLoading(false);
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUserId) return;

    await supabase
      .from("notifications")
      .update({ is_read: true } as never)
      .eq("user_id", currentUserId)
      .eq("is_read", false);

    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, is_read: true }))
    );
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await supabase
        .from("notifications")
        .update({ is_read: true } as never)
        .eq("id", notification.id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    }

    if (notification.entity_type === "post" && notification.entity_id) {
      router.push(`/posts/${notification.entity_id}`);
    } else if (notification.type === "follow") {
      router.push(`/users/${notification.actor_id}`);
    }
  };

  const getNotificationText = (notification: Notification) => {
    const actorName = notification.actor?.full_name || "Someone";

    switch (notification.type) {
      case "like":
        return `liked your post`;
      case "mention":
        return `mentioned you in a post`;
      case "reply":
        return `replied to your post`;
      case "follow":
        return `started following you`;
      case "repost":
        return `reposted your post`;
      default:
        return "interacted with you";
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "like":
        return { icon: "favorite", color: "text-red-500", bg: "bg-red-50" };
      case "mention":
        return { icon: "alternate_email", color: "text-blue-500", bg: "bg-blue-50" };
      case "reply":
        return { icon: "chat_bubble", color: "text-green-500", bg: "bg-green-50" };
      case "follow":
        return { icon: "person_add", color: "text-purple-500", bg: "bg-purple-50" };
      case "repost":
        return { icon: "repeat", color: "text-orange-500", bg: "bg-orange-50" };
      default:
        return { icon: "notifications", color: "text-slate-500", bg: "bg-slate-50" };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-3 items-center mb-2">
          <h2 className="text-slate-900 text-2xl font-bold leading-tight">All Activity</h2>
        </div>
        <p className="text-sm text-slate-500">Loading notifications…</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-3 items-center mb-2">
          <h2 className="text-slate-900 text-2xl font-bold leading-tight">All Activity</h2>
        </div>

        <div className="flex flex-col rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-slate-400">
                  notifications_none
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No notifications yet</h3>
                <p className="text-sm text-slate-500">
                  When someone interacts with your posts, you'll see it here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-3 items-center mb-2">
        <h2 className="text-slate-900 text-2xl font-bold leading-tight">All Activity</h2>
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex flex-col rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        {notifications.map((notification) => {
          const { icon, color, bg } = getNotificationIcon(notification.type);
          const isUnread = !notification.is_read;

          return (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`flex gap-3 p-4 border-b border-slate-200 last:border-b-0 cursor-pointer hover:bg-slate-50 transition-colors ${
                isUnread ? "bg-blue-50/50" : ""
              }`}
            >
              <div className="relative">
                <Avatar
                  src={notification.actor?.avatar_url ?? undefined}
                  fallback={notification.actor?.full_name?.[0] ?? "?"}
                  className="size-10"
                />
                <div
                  className={`absolute -bottom-1 -right-1 size-5 rounded-full ${bg} flex items-center justify-center border-2 border-white`}
                >
                  <span className={`material-symbols-outlined text-xs ${color}`}>
                    {icon}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-semibold text-slate-900 hover:underline">
                        {notification.actor?.full_name || "Someone"}
                      </span>
                      {notification.actor?.is_verified && <VerifiedBadge />}
                      <span className="text-slate-600 text-sm">
                        {getNotificationText(notification)}
                      </span>
                    </div>

                    {notification.post?.content && notification.type !== "follow" && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {notification.post.content}
                      </p>
                    )}

                    <p className="text-xs text-slate-400 mt-1">
                      {getTimeAgo(notification.created_at)}
                    </p>
                  </div>

                  {isUnread && (
                    <div className="size-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
