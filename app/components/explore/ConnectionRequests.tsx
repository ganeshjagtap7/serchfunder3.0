"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar } from "@/app/components/ui/Avatar";

interface ConnectionRequestsProps {
  currentUserId: string | null;
}

interface ConnectionRequest {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  requester?: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
}

export default function ConnectionRequests({ currentUserId }: ConnectionRequestsProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      loadRequests();
    }
  }, [currentUserId]);

  const loadRequests = async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("connections")
      .select(`
        *,
        requester:requester_id(id, full_name, username, avatar_url, bio)
      `)
      .eq("receiver_id", currentUserId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(3);

    if (!error && data) {
      setRequests(data as any);
    }

    setLoading(false);
  };

  const handleConfirm = async (requestId: string, requesterId: string) => {
    const { error } = await supabase
      .from("connections")
      .update({ status: "accepted" } as never)
      .eq("id", requestId);

    if (!error) {
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    }
  };

  const handleDelete = async (requestId: string) => {
    await supabase.from("connections").delete().eq("id", requestId);

    setRequests((prev) => prev.filter((req) => req.id !== requestId));
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  if (loading || requests.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-border-light dark:border-border-dark">
      <div className="px-4 py-3 flex justify-between items-center bg-surface-light/30 dark:bg-surface-dark/30">
        <h2 className="font-bold text-lg">Connection Requests</h2>
        <a className="text-primary text-sm font-medium hover:underline" href="/explore/requests">
          See all ({requests.length})
        </a>
      </div>

      {requests.map((request) => (
        <div
          key={request.id}
          className="px-4 py-4 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors cursor-pointer flex gap-4"
        >
          <div className="shrink-0">
            <Avatar
              src={request.requester?.avatar_url ?? undefined}
              fallback={request.requester?.full_name?.[0] ?? "?"}
              className="size-12"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span
                  onClick={() => router.push(`/users/${request.requester_id}`)}
                  className="font-bold hover:underline text-[15px]"
                >
                  {request.requester?.full_name || "Unknown"}
                </span>
                <span className="text-text-secondary dark:text-text-secondary-dark text-sm">
                  @{request.requester?.username || "user"}
                </span>
              </div>
              <span className="text-text-secondary dark:text-text-secondary-dark text-xs mt-1">
                {getTimeAgo(request.created_at)}
              </span>
            </div>

            {request.requester?.bio && (
              <p className="text-sm mt-1 text-text-main dark:text-text-main-dark line-clamp-2">
                {request.requester.bio}
              </p>
            )}

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleConfirm(request.id, request.requester_id)}
                className="bg-black dark:bg-white text-white dark:text-black font-bold rounded-full px-5 py-1.5 text-sm hover:opacity-90 transition-opacity"
              >
                Confirm
              </button>
              <button
                onClick={() => handleDelete(request.id)}
                className="border border-border-dark/30 dark:border-border-light/30 font-bold rounded-full px-5 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
