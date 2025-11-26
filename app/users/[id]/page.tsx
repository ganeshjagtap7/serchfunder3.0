"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      setProfile(data as Profile | null);
      setLoading(false);
    };

    if (userId) load();
  }, [userId]);

  const handleMessage = () => {
    router.push(`/messages/${userId}`);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading user...</p>
        ) : !profile ? (
          <p className="text-red-400 text-sm">User not found.</p>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-lg font-semibold">
                {(profile.full_name || "User")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {profile.full_name || "Unnamed user"}
                </h1>
                <p className="text-xs text-slate-400 break-all">
                  ID: {profile.id}
                </p>
              </div>
            </div>

            {profile.bio && (
              <p className="text-sm text-slate-200 whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}

            <button
              onClick={handleMessage}
              className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Message
            </button>
          </div>
        )}
      </main>
    </>
  );
}
