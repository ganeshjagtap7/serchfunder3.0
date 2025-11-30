"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const otherUserId = params.id as string;

  const [me, setMe] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setMe(user.id);

      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      setMessages((data || []) as Message[]);
      setLoading(false);
    };

    if (otherUserId) load();
  }, [otherUserId]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !me) return;

    setSending(true);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: me,
        receiver_id: otherUserId,
        content,
      } as any)
      .select("*")
      .single();

    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
      setContent("");
    }

    setSending(false);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6 flex flex-col h-[calc(100vh-80px)]">
        <h1 className="text-lg font-semibold mb-4 text-foreground">
          Conversation with user {otherUserId.slice(0, 6)}...
        </h1>

        <div className="flex-1 overflow-y-auto space-y-2 border border-border rounded-md p-3 bg-card">
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No messages yet. Say hi
            </p>
          ) : (
            messages.map((m) => {
              const mine = m.sender_id === me;
              return (
                <div
                  key={m.id}
                  className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${mine
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-muted text-foreground"
                    }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <p className="mt-1 text-[10px] opacity-70">
                    {new Date(m.created_at).toLocaleTimeString()}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSend} className="mt-3 flex gap-2">
          <input
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </main>
    </>
  );
}
