"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DynamicHeader from "@/app/components/dashboard/DynamicHeader";
import ExploreFilters from "@/app/components/explore/ExploreFilters";
import ConnectionRequests from "@/app/components/explore/ConnectionRequests";
import WhoToFollow from "@/app/components/explore/WhoToFollow";
import PeopleList from "@/app/components/explore/PeopleList";
import TrendingNetwork from "@/app/components/explore/TrendingNetwork";

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [filters, setFilters] = useState({
    role: searchParams.get("role") || "all",
    interests: searchParams.get("interests")?.split(",") || []
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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

    if (profileData && 'avatar_url' in profileData) {
      setCurrentUserAvatar((profileData as any).avatar_url || null);
    }
    setLoading(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/explore?${params.toString()}`);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.role !== "all") {
      params.set("role", newFilters.role);
    }
    if (newFilters.interests.length > 0) {
      params.set("interests", newFilters.interests.join(","));
    }
    if (activeTab !== "suggestions") {
      params.set("tab", activeTab);
    }
    router.push(`/explore?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f6f6f8' }}>
        <DynamicHeader avatarUrl={currentUserAvatar ?? undefined} />
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f8' }}>
      <DynamicHeader avatarUrl={currentUserAvatar ?? undefined} />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - FILTERS */}
          <aside className="hidden lg:block lg:col-span-3">
            <ExploreFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          {/* CENTER - MAIN CONTENT */}
          <div className="col-span-12 lg:col-span-6">
            {/* TABS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => handleTabChange("suggestions")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "suggestions"
                      ? "text-primary border-b-2 border-primary"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Suggestions
                </button>
                <button
                  onClick={() => handleTabChange("following")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "following"
                      ? "text-primary border-b-2 border-primary"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Following
                </button>
                <button
                  onClick={() => handleTabChange("followers")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "followers"
                      ? "text-primary border-b-2 border-primary"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Followers
                </button>
              </div>
            </div>

            {/* CONNECTION REQUESTS */}
            {activeTab === "suggestions" && (
              <ConnectionRequests currentUserId={currentUserId} />
            )}

            {/* WHO TO FOLLOW */}
            {activeTab === "suggestions" && (
              <WhoToFollow currentUserId={currentUserId} filters={filters} />
            )}

            {/* PEOPLE LIST */}
            <PeopleList
              currentUserId={currentUserId}
              activeTab={activeTab}
              filters={filters}
            />
          </div>

          {/* RIGHT SIDEBAR - TRENDING */}
          <aside className="hidden lg:block lg:col-span-3">
            <TrendingNetwork />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f6f6f8' }}><p className="text-sm text-slate-500">Loading...</p></div>}>
      <ExploreContent />
    </Suspense>
  );
}
