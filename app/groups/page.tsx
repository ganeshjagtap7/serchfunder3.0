"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Group = {
  id: string;
  name: string;
  description: string | null;
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("groups")
        .select("id, name, description")
        .order("created_at", { ascending: false });

      setGroups((data as Group[]) || []);
      setLoading(false);
    };

    loadGroups();
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Groups</h1>
          <Link
            href="/groups/create"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create group
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No groups yet. Be the first to create one!
          </p>
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <Link
                key={g.id}
                href={`/groups/${g.id}`}
                className="block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-indigo-500"
              >
                <h2 className="text-sm font-semibold text-slate-100">
                  {g.name}
                </h2>
                {g.description && (
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {g.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
