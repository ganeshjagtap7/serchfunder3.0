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
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create group
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No groups yet. Be the first to create one!
          </p>
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <Link
                key={g.id}
                href={`/groups/${g.id}`}
                className="block rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors"
              >
                <h2 className="text-sm font-semibold text-foreground">
                  {g.name}
                </h2>
                {g.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
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
