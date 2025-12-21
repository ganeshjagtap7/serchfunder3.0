"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/app/components/dashboard/Header";
import NotificationsSidebar from "@/app/components/notifications/NotificationsSidebar";
import NotificationsList from "@/app/components/notifications/NotificationsList";

export default function NotificationsPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    setCurrentUserAvatar((profile as any)?.avatar_url || null);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f6f6f8' }}>
        <Header avatarUrl={currentUserAvatar ?? undefined} />
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-slate-500">Loading notifications…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f8' }}>
      <Header avatarUrl={currentUserAvatar ?? undefined} />

      <main className="flex-grow w-full max-w-7xl mx-auto p-6 lg:p-8">
        <div className="grid grid-cols-12 gap-8">
          <aside className="col-span-12 md:col-span-3">
            <NotificationsSidebar filter={filter} onFilterChange={setFilter} />
          </aside>

          <div className="col-span-12 md:col-span-9">
            <NotificationsList
              currentUserId={currentUserId}
              filter={filter}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
