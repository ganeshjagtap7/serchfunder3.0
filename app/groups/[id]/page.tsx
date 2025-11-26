"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/lib/supabaseClient";

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

  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .maybeSingle();

      setGroup(data as Group | null);
      setLoading(false);
    };

    if (groupId) loadGroup();
  }, [groupId]);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6 space-y-4">
        {loading && <p className="text-slate-300">Loading group...</p>}
        {!loading && !group && (
          <p className="text-red-400">Group not found.</p>
        )}
        {group && (
          <>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            {group.description && (
              <p className="text-slate-300">{group.description}</p>
            )}

            <p className="mt-6 text-slate-400 text-sm">
              Group posts & join/leave logic coming next.
            </p>
          </>
        )}
      </main>
    </>
  );
}
