"use client";

import { FormEvent, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in.");
      setSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from("groups")
      .insert({
        name,
        description,
        owner_id: user.id,
      })
      .select("id")
      .single();

    if (error || !data) {
      setError(error?.message || "Could not create group.");
      setSaving(false);
      return;
    }

    // add creator as member
    await supabase.from("group_members").insert({
      group_id: data.id,
      user_id: user.id,
      role: "owner",
    });

    router.push(`/groups/${data.id}`);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create a group</h1>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Group name
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Searchfunders in India"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group about?"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create group"}
          </button>
        </form>
      </main>
    </>
  );
}
