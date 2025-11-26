"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import GroupPosts from "./GroupPosts";

type Group = {
  id: string;
  name: string;
  description: string | null;
};

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      // get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      // load group
      const { data: groupData } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .maybeSingle();

      setGroup(groupData as Group | null);

      // check membership
      if (user && groupId) {
        const { data: membership } = await supabase
          .from("group_members")
          .select("*")
          .eq("group_id", groupId)
          .eq("user_id", user.id)
          .maybeSingle();

        setIsMember(!!membership);
      }

      setLoading(false);
    };

    if (groupId) loadData();
  }, [groupId]);

  const handleJoin = async () => {
    if (!userId) {
      setError("You must be logged in to join.");
      return;
    }
    setJoining(true);
    setError(null);

    const { error } = await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: userId,
      role: "member",
    });

    if (error) {
      setError(error.message);
    } else {
      setIsMember(true);
    }
    setJoining(false);
  };

  const handleLeave = async () => {
    if (!userId) return;
    setJoining(true);
    setError(null);

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (error) {
      setError(error.message);
    } else {
      setIsMember(false);
    }
    setJoining(false);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {loading && <p className="text-muted-foreground">Loading group...</p>}

        {!loading && !group && (
          <p className="text-red-400">Group not found.</p>
        )}

        {group && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{group.name}</h1>
                {group.description && (
                  <p className="mt-1 text-muted-foreground">{group.description}</p>
                )}
              </div>

              {userId && (
                <button
                  onClick={isMember ? handleLeave : handleJoin}
                  disabled={joining}
                  className={`rounded-md px-4 py-2 text-sm font-medium text-primary-foreground ${isMember
                      ? "bg-muted text-muted-foreground hover:bg-muted/80"
                      : "bg-primary hover:bg-primary/90"
                    } disabled:opacity-60`}
                >
                  {joining
                    ? isMember
                      ? "Leaving..."
                      : "Joining..."
                    : isMember
                      ? "Leave group"
                      : "Join group"}
                </button>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* Group posts section */}
            <GroupPosts groupId={group.id} isMember={isMember} />
          </>
        )}
      </main>
    </>
  );
}
