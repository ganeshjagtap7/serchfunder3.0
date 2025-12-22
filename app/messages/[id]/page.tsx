"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DynamicHeader from "@/app/components/dashboard/DynamicHeader";
import ConversationList from "@/app/components/messages/ConversationList";
import ConversationHeader from "@/app/components/messages/ConversationHeader";
import MessageThread from "@/app/components/messages/MessageThread";
import MessageComposer from "@/app/components/messages/MessageComposer";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  created_at: string;
  seen_at: string | null;
}

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const otherUserId = params.id as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUserProfile, setOtherUserProfile] = useState<{
    name: string;
    username: string;
    avatar: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversationListKey, setConversationListKey] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUserId && otherUserId) {
      loadConversation();
      markMessagesAsSeen();
    }
  }, [currentUserId, otherUserId]);

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
  };

  const loadConversation = async () => {
    setLoading(true);

    const { data: otherProfile } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", otherUserId)
      .single();

    if (otherProfile) {
      const profile = otherProfile as any;
      const username = profile.full_name?.toLowerCase().replace(/\s+/g, "_") || "user";
      setOtherUserProfile({
        name: profile.full_name || "Unknown User",
        username: `@${username}`,
        avatar: profile.avatar_url || null,
      });
    }

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
      )
      .order("created_at", { ascending: true });

    setMessages((data || []) as Message[]);
    setLoading(false);
  };

  const markMessagesAsSeen = async () => {
    if (!currentUserId) return;

    await supabase
      .from("messages")
      .update({ seen_at: new Date().toISOString() } as never)
      .eq("receiver_id", currentUserId)
      .eq("sender_id", otherUserId)
      .is("seen_at", null);
  };

  const handleMessageSent = () => {
    loadConversation();
    setConversationListKey(prev => prev + 1); // Force ConversationList to refresh
  };

  if (loading || !currentUserId || !otherUserProfile) {
    return (
      <div className="flex flex-col h-screen bg-white overflow-hidden">
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
        <ConversationList key={conversationListKey} currentUserId={currentUserId} />

        <section className="flex flex-1 flex-col h-full bg-white relative min-w-0">
          <ConversationHeader
            name={otherUserProfile.name}
            username={otherUserProfile.username}
            avatarUrl={otherUserProfile.avatar}
          />

          <MessageThread
            messages={messages}
            currentUserId={currentUserId}
            otherUserName={otherUserProfile.name}
            otherUserAvatar={otherUserProfile.avatar}
          />

          <MessageComposer
            currentUserId={currentUserId}
            receiverId={otherUserId}
            onMessageSent={handleMessageSent}
          />
        </section>
      </main>
    </div>
  );
}
