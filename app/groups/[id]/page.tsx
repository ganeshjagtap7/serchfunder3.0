"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DynamicHeader from "@/app/components/dashboard/DynamicHeader";
import ConversationList from "@/app/components/messages/ConversationList";
import ConversationHeader from "@/app/components/messages/ConversationHeader";
import GroupMessageThread from "@/app/components/groups/GroupMessageThread";
import GroupMessageComposer from "@/app/components/groups/GroupMessageComposer";
import Link from "next/link";

interface GroupMessage {
  id: string;
  sender_id: string;
  group_id: string;
  content: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string | null;
  };
}

export default function GroupPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const groupId = params.id as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [group, setGroup] = useState<{
    name: string;
    description: string | null;
    owner_id: string;
  } | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversationListKey, setConversationListKey] = useState(0);

  useEffect(() => {
    checkAuthAndLoadGroup();
  }, []);

  useEffect(() => {
    if (currentUserId && groupId && isMember) {
      loadMessages();
      subscribeToMessages();
    }
  }, [currentUserId, groupId, isMember]);

  const checkAuthAndLoadGroup = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Redirect or show login state? User complained about redirect.
      // But for chat, we probably need auth.
      // I will just let the "Not logged in" UI handle it if I decide not to redirect.
      // But to be consistent with Chat Page request:
      // router.push("/login"); 
      // return;
      setLoading(false); // Let the UI show a login prompt instead of redirecting
      return;
    }

    setCurrentUserId(user.id);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setCurrentUserAvatar((profileData as any).avatar_url);
    }

    // Load Group
    const { data: groupData, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error || !groupData) {
      // Group not found
      setLoading(false);
      return;
    }

    setGroup(groupData);

    // Check Membership
    const { data: membership } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .maybeSingle();

    setIsMember(!!membership || (groupData as any).owner_id === user.id);
    setLoading(false);
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      // Fetch sender profiles separately
      const senderIds = [...new Set(data.map((msg: any) => msg.sender_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", senderIds);

      const profileMap = new Map(
        (profiles || []).map((p: any) => [p.id, { full_name: p.full_name, avatar_url: p.avatar_url }])
      );

      const messagesWithSenders = data.map((msg: any) => ({
        ...msg,
        sender: profileMap.get(msg.sender_id) || { full_name: "Unknown", avatar_url: null }
      }));

      setMessages(messagesWithSenders as any);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`group-chat-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          // Fetch the sender info for the new message
          const { data: senderData } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            sender: senderData
          };
          setMessages((prev) => [...prev, newMessage as any]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }

  const handleMessageSent = () => {
    loadMessages();
    setConversationListKey(prev => prev + 1);
  };

  const handleJoinGroup = async () => {
    if (!currentUserId) return;

    const { error } = await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: currentUserId
      } as any);

    if (!error) {
      setIsMember(true);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white overflow-hidden">
        <DynamicHeader avatarUrl={currentUserAvatar ?? undefined} />
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-slate-500">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="flex flex-col h-screen bg-white overflow-hidden">
        <DynamicHeader avatarUrl={undefined} />
        <div className="flex flex-col items-center justify-center flex-1 p-6">
          <h2 className="text-xl font-semibold mb-2">Login Required</h2>
          <p className="text-slate-600 mb-4">You need to log in to view this group.</p>
          <Link href="/login" className="px-4 py-2 bg-primary text-white rounded-md">Log in</Link>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex flex-col h-screen bg-white overflow-hidden">
        <DynamicHeader avatarUrl={currentUserAvatar ?? undefined} />
        <div className="flex items-center justify-center flex-1">
          <p className="text-red-500">Group not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <DynamicHeader avatarUrl={currentUserAvatar ?? undefined} />

      <main className="flex flex-1 w-full overflow-hidden bg-white">
        <ConversationList key={conversationListKey} currentUserId={currentUserId} />

        <section className="flex flex-1 flex-col h-full bg-white relative min-w-0">
          <ConversationHeader
            name={group.name}
            username={`${isMember ? 'Member' : 'Not Joined'} • ${group.description || 'No description'}`}
            avatarUrl={null} // Group avatar currently not supported in schema
          />

          {isMember ? (
            <>
              <GroupMessageThread
                messages={messages}
                currentUserId={currentUserId}
              />

              <GroupMessageComposer
                currentUserId={currentUserId}
                groupId={groupId}
                onMessageSent={handleMessageSent}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Join {group.name}</h3>
              <p className="text-slate-600 max-w-md mb-6">{group.description}</p>
              <button
                onClick={handleJoinGroup}
                className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Join Group
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
