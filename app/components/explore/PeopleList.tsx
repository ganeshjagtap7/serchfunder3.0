"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar } from "@/app/components/ui/Avatar";

interface PeopleListProps {
  currentUserId: string | null;
  activeTab: string;
  filters: {
    role: string;
    interests: string[];
  };
}

interface Person {
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

export default function PeopleList({ currentUserId, activeTab, filters }: PeopleListProps) {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (currentUserId) {
      loadPeople();
    }
  }, [currentUserId, activeTab, filters]);

  const loadPeople = async () => {
    if (!currentUserId) return;

    setLoading(true);

    if (activeTab === "following") {
      const { data: following } = await supabase
        .from("follows")
        .select(`
          following_id,
          following:following_id(id, full_name, username, avatar_url, bio, role, interests, location)
        `)
        .eq("follower_id", currentUserId);

      if (following) {
        setPeople(
          following
            .map((f: any) => ({ ...f.following, is_following: true }))
            .filter((p: any) => p.id)
        );
      }
    } else if (activeTab === "followers") {
      const { data: followers } = await supabase
        .from("follows")
        .select(`
          follower_id,
          follower:follower_id(id, full_name, username, avatar_url, bio, role, interests, location)
        `)
        .eq("following_id", currentUserId);

      const { data: following } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUserId);

      const followingIds = following?.map((f: any) => f.following_id) || [];

      if (followers) {
        setPeople(
          followers
            .map((f: any) => ({
              ...f.follower,
              is_following: followingIds.includes(f.follower?.id),
            }))
            .filter((p: any) => p.id)
        );
      }
    } else {
      const { data: following } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUserId);

      const followingIds = following?.map((f: any) => f.following_id) || [];
      followingIds.push(currentUserId);

      let query = supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, bio, role, interests, location")
        .not("id", "in", `(${followingIds.join(",")})`);

      if (filters.role !== "all") {
        query = query.eq("role", filters.role);
      }

      const { data, error } = await query;

      if (!error && data) {
        setPeople(data.map((person: any) => ({ ...person, is_following: false })));
      }
    }

    setLoading(false);
  };

  const handleFollow = async (userId: string) => {
    if (!currentUserId) return;

    const person = people.find((p) => p.id === userId);
    if (!person) return;

    if (person.is_following) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", userId);

      setPeople((prev) => prev.map((p) => (p.id === userId ? { ...p, is_following: false } : p)));
    } else {
      await supabase.from("follows").insert({
        follower_id: currentUserId,
        following_id: userId,
      } as never);

      setPeople((prev) => prev.map((p) => (p.id === userId ? { ...p, is_following: true } : p)));
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Loading...</p>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-16 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-text-secondary dark:text-text-secondary-dark">
              group
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-1">
              No people found
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              Try adjusting your filters or check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const displayedPeople = showMore ? people : people.slice(0, 10);

  return (
    <div className="flex flex-col">
      {displayedPeople.map((person) => (
        <div
          key={person.id}
          className="px-4 py-4 border-b border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors cursor-pointer flex gap-4"
        >
          <div className="shrink-0">
            <Avatar
              src={person.avatar_url ?? undefined}
              fallback={person.full_name?.[0] ?? "?"}
              className="size-12"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="group/user">
                <div
                  onClick={() => router.push(`/users/${person.id}`)}
                  className="font-bold text-[15px] group-hover/user:underline"
                >
                  {person.full_name || "Unknown"}
                </div>
                <div className="text-text-secondary dark:text-text-secondary-dark text-sm">
                  @{person.username || "user"}
                </div>
              </div>

              <button
                onClick={() => handleFollow(person.id)}
                className={`font-bold rounded-full px-4 py-1.5 text-sm transition-opacity ${
                  person.is_following
                    ? "border border-border-dark/30 dark:border-border-light/30 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-600"
                    : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                }`}
              >
                {person.is_following ? "Following" : "Follow"}
              </button>
            </div>

            {person.bio && <p className="text-sm mt-1 mb-2 line-clamp-2">{person.bio}</p>}

            {person.location && (
              <div className="flex items-center gap-1 text-xs text-text-secondary dark:text-text-secondary-dark mb-2">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>Based in {person.location}</span>
              </div>
            )}

            {person.interests && person.interests.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {person.interests.slice(0, 3).map((interest) => (
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

      {people.length > 10 && !showMore && (
        <div className="p-4 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors cursor-pointer text-center">
          <button
            onClick={() => setShowMore(true)}
            className="text-primary hover:underline text-sm font-medium"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
