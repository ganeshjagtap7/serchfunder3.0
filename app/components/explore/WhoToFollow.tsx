"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar } from "@/app/components/ui/Avatar";

interface WhoToFollowProps {
  currentUserId: string | null;
  filters: {
    role: string;
    interests: string[];
  };
}

interface User {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  interests: string[] | null;
  location: string | null;
  is_following?: boolean;
}

export default function WhoToFollow({ currentUserId, filters }: WhoToFollowProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      loadSuggestions();
    }
  }, [currentUserId, filters]);

  const loadSuggestions = async () => {
    if (!currentUserId) return;

    setLoading(true);

    const { data: following } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", currentUserId);

    const followingIds = following?.map((f: any) => f.following_id) || [];
    followingIds.push(currentUserId);

    let query = supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url, bio, role, interests, location")
      .not("id", "in", `(${followingIds.join(",")})`)
      .limit(4);

    if (filters.role !== "all") {
      query = query.eq("role", filters.role);
    }

    const { data, error } = await query;

    if (!error && data) {
      setUsers(data.map((user: any) => ({ ...user, is_following: false })));
    }

    setLoading(false);
  };

  const handleFollow = async (userId: string) => {
    if (!currentUserId) return;

    await supabase.from("follows").insert({
      follower_id: currentUserId,
      following_id: userId,
    } as never);

    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, is_following: true } : user)));

    // Create follow notification (non-blocking, exclude self-follows)
    if (userId !== currentUserId) {
      (async () => {
        try {
          const { error } = await supabase.from("notifications").insert({
            user_id: userId,
            actor_id: currentUserId,
            type: "follow",
            entity_type: "profile",
            entity_id: currentUserId,
            is_read: false,
          } as any);

          if (error) {
            console.error("Failed to create follow notification:", error);
          }
        } catch (err) {
          console.error("Failed to create follow notification:", err);
        }
      })();
    }
  };

  if (loading || users.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark bg-surface-light/30 dark:bg-surface-dark/30">
        <h2 className="font-bold text-lg">Who to follow</h2>
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          className="px-4 py-4 border-b border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors cursor-pointer flex gap-4"
        >
          <div className="shrink-0">
            <Avatar
              src={user.avatar_url ?? undefined}
              fallback={user.full_name?.[0] ?? "?"}
              className="size-12"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="group/user">
                <div
                  onClick={() => router.push(`/users/${user.id}`)}
                  className="font-bold text-[15px] group-hover/user:underline"
                >
                  {user.full_name || "Unknown"}
                </div>
                <div className="text-text-secondary dark:text-text-secondary-dark text-sm">
                  @{user.username || "user"}
                </div>
              </div>

              {!user.is_following ? (
                <button
                  onClick={() => handleFollow(user.id)}
                  className="bg-black dark:bg-white text-white dark:text-black font-bold rounded-full px-4 py-1.5 text-sm hover:opacity-90 transition-opacity"
                >
                  Follow
                </button>
              ) : (
                <button
                  disabled
                  className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold rounded-full px-4 py-1.5 text-sm cursor-not-allowed"
                >
                  Following
                </button>
              )}
            </div>

            {user.bio && <p className="text-sm mt-1 mb-2 line-clamp-2">{user.bio}</p>}

            {user.location && (
              <div className="flex items-center gap-1 text-xs text-text-secondary dark:text-text-secondary-dark mb-2">
                <span className="material-symbols-outlined text-[16px] text-text-secondary dark:text-text-secondary-dark">
                  location_on
                </span>
                <span>Based in {user.location}</span>
              </div>
            )}

            {user.interests && user.interests.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {user.interests.slice(0, 2).map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="p-4 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors cursor-pointer text-center">
        <a className="text-primary hover:underline text-sm font-medium" href="/explore?tab=suggestions">
          Show more
        </a>
      </div>
    </div>
  );
}
