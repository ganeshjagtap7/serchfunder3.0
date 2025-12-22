"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";

interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string | null;
  other_user_username: string | null;
  other_user_avatar: string | null;
  last_message: string;
  last_message_time: string;
  is_unread: boolean;
  is_sender: boolean;
}

interface ConversationListProps {
  currentUserId: string;
}

export default function ConversationList({ currentUserId }: ConversationListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadConversations();
  }, [currentUserId]);

  const loadConversations = async () => {
    setLoading(true);

    if (!currentUserId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select(`
        id,
        sender_id,
        receiver_id,
        content,
        created_at,
        seen_at
      `)
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading conversations:", error);
    }

    if (!messages || messages.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const conversationMap: Record<string, any> = {};

    for (const msg of messages as any[]) {
      const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;

      if (!conversationMap[otherUserId]) {
        conversationMap[otherUserId] = {
          other_user_id: otherUserId,
          last_message: msg.content,
          last_message_time: msg.created_at,
          is_unread: msg.receiver_id === currentUserId && !msg.seen_at,
          is_sender: msg.sender_id === currentUserId,
        };
      }
    }

    const userIds = Object.keys(conversationMap);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds);

    const conversationsList = Object.values(conversationMap).map((conv: any) => {
      const profile = profiles?.find((p: any) => p.id === conv.other_user_id) as any;
      const username = profile?.full_name?.toLowerCase().replace(/\s+/g, "_") || "user";

      return {
        id: conv.other_user_id,
        other_user_id: conv.other_user_id,
        other_user_name: profile?.full_name || "Unknown User",
        other_user_username: `@${username}`,
        other_user_avatar: profile?.avatar_url || null,
        last_message: conv.last_message,
        last_message_time: conv.last_message_time,
        is_unread: conv.is_unread,
        is_sender: conv.is_sender,
      };
    });

    setConversations(conversationsList);
    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user_username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActiveConversationId = () => {
    const match = pathname?.match(/\/messages\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const activeConversationId = getActiveConversationId();

  return (
    <section className="flex flex-col w-full md:w-[380px] lg:w-[420px] bg-white border-r border-slate-100 shrink-0">
      <div className="flex items-center justify-between px-4 h-[60px] shrink-0 bg-white/95 backdrop-blur-sm border-b border-transparent">
        <h2 className="text-xl font-bold text-slate-900">Messages</h2>
        <div className="flex gap-1 text-slate-900">
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Settings">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="New Message">
            <span className="material-symbols-outlined text-[22px]">library_add</span>
          </button>
        </div>
      </div>

      <div className="px-4 pb-3 pt-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary">search</span>
          </div>
          <input
            className="block w-full rounded-full border border-transparent bg-slate-100 py-2 pl-10 pr-3 leading-5 placeholder-slate-500 text-slate-900 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:placeholder-slate-400 text-sm transition-colors"
            placeholder="Search Direct Messages"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => router.push(`/messages/${conv.other_user_id}`)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-4 hover:bg-slate-50 transition-colors relative ${
                activeConversationId === conv.other_user_id ? "bg-slate-100 border-r-[3px] border-primary" : ""
              }`}
            >
              {conv.is_unread && !conv.is_sender && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 size-2.5 bg-primary rounded-full ring-4 ring-white"></div>
              )}
              <div className="bg-slate-200 rounded-full size-12 shrink-0 overflow-hidden">
                {conv.other_user_avatar ? (
                  <img
                    src={conv.other_user_avatar}
                    alt={conv.other_user_name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600 font-bold text-xl uppercase">
                    {conv.other_user_name?.[0] || "?"}
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span className="font-bold text-slate-900 truncate text-[15px]">
                      {conv.other_user_name}
                    </span>
                    <span className="text-slate-500 text-sm truncate">{conv.other_user_username}</span>
                  </div>
                  <span className="text-slate-500 text-xs shrink-0">{formatTime(conv.last_message_time)}</span>
                </div>
                <p
                  className={`text-sm truncate ${
                    conv.is_unread && !conv.is_sender ? "text-slate-900 font-bold" : "text-slate-500"
                  }`}
                >
                  {conv.last_message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
