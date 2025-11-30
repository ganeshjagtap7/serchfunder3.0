"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GroupChat({ groupId }: { groupId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  async function loadMessages() {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*, sender_id, created_at")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (!error && data) setMessages(data);
  }

  useEffect(() => {
    loadMessages();

    // Real-time subscription
    const channel = supabase
      .channel("group-chat-" + groupId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  async function sendMessage() {
    if (!input.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("group_messages").insert({
      group_id: groupId,
      sender_id: user?.id,
      content: input.trim(),
    } as any);

    setInput("");
  }

  return (
    <div className="mt-10 border rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Group Chat</h2>

      <div
        className="h-64 overflow-y-auto border rounded-md p-3 bg-slate-50"
        id="chatbox"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <p className="text-sm">
              <span className="font-semibold">{msg.sender_id.slice(0, 6)}:</span>{" "}
              {msg.content}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          className="flex-1 border rounded-md px-3 py-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
