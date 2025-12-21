"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DynamicHeader from "@/app/components/dashboard/DynamicHeader";
import ConversationList from "@/app/components/messages/ConversationList";

export default function MessagesPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setCurrentUserId(user.id);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profileData && "avatar_url" in profileData) {
      setCurrentUserAvatar((profileData as any).avatar_url || null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f6f6f8" }}>
        <DynamicHeader avatarUrl={currentUserAvatar ?? undefined} />
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <DynamicHeader avatarUrl={currentUserAvatar ?? undefined} />

      <main className="flex flex-1 w-full overflow-hidden bg-white">
        {currentUserId && <ConversationList currentUserId={currentUserId} />}

        <section className="hidden md:flex flex-1 flex-col h-full bg-white items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="size-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-slate-400">mail</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Select a message</h2>
            <p className="text-slate-500">
              Choose from your existing conversations or start a new one
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
