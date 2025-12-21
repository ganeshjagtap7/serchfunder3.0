"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface TrendingTopic {
  id: string;
  name: string;
  category: string;
  post_count: number;
}

export default function TrendingNetwork() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingTopics();
  }, []);

  const loadTrendingTopics = async () => {
    const { data, error } = await supabase
      .from("topics")
      .select("id, name, category, post_count")
      .order("post_count", { ascending: false })
      .limit(3);

    if (!error && data) {
      setTopics(data);
    }

    setLoading(false);
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-border-light dark:border-border-dark sticky top-[84px]">
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-bold">Trending in Network</h2>
      </div>

      {loading ? (
        <div className="p-4 text-center">
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Loading...</p>
        </div>
      ) : topics.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            No trending topics yet
          </p>
        </div>
      ) : (
        <>
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors relative"
            >
              <div className="flex justify-between text-xs text-text-secondary dark:text-text-secondary-dark mb-0.5">
                <span>
                  {topic.category} • Trending
                </span>
                <span className="material-symbols-outlined text-base">more_horiz</span>
              </div>
              <div className="font-bold text-[15px]">{topic.name}</div>
              <div className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
                {formatCount(topic.post_count)} posts
              </div>
            </div>
          ))}

          <div className="p-4 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
            <span className="text-primary text-sm font-medium">Show more</span>
          </div>
        </>
      )}

      <nav className="flex flex-wrap gap-x-3 gap-y-1 px-4 pb-4 text-xs text-text-secondary dark:text-text-secondary-dark border-t border-border-light dark:border-border-dark pt-4 mt-2">
        <a className="hover:underline" href="#">
          Terms of Service
        </a>
        <a className="hover:underline" href="#">
          Privacy Policy
        </a>
        <a className="hover:underline" href="#">
          Cookie Policy
        </a>
        <a className="hover:underline" href="#">
          Accessibility
        </a>
        <a className="hover:underline" href="#">
          Ads info
        </a>
        <span className="mt-1">© 2024 Searchfunder, Inc.</span>
      </nav>
    </div>
  );
}
