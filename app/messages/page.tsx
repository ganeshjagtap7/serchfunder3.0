"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Thread = {
  other_user_id: string;
  last_message: string;
  last_at: string;
};

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherIdInput, setOtherIdInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setThreads([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      const byOther: Record<string, Thread> = {};

      (data || []).forEach((m: any) => {
        const other =
          m.sender_id === user.id ? m.receiver_id : m.sender_id;

        if (!byOther[other]) {
          byOther[other] = {
            other_user_id: other,
            last_message: m.content,
            last_at: m.created_at,
          };
        }
      });

      setThreads(Object.values(byOther));
      setLoading(false);
    };

    load();
  }, []);

  const handleStartChat = () => {
    const id = otherIdInput.trim();
    if (!id) return;
    router.push(`/messages/${id}`);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Messages</h1>

        {/* Start new conversation */}
        {/* Start new conversation */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <p className="text-sm text-foreground font-medium">
            Start a new conversation
          </p>
          <p className="text-xs text-muted-foreground">
            For now, paste another user&apos;s ID (from Supabase
            auth.users) to test DMs.
          </p>
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              placeholder="Other user id…"
              value={otherIdInput}
              onChange={(e) => setOtherIdInput(e.target.value)}
            />
            <button
              onClick={handleStartChat}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Open chat
            </button>
          </div>
        </div>

        {/* Existing threads */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Your conversations
          </h2>

          {loading ? (
            <p className="text-muted-foreground text-sm">
              Loading conversations...
            </p>
          ) : threads.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No conversations yet. Start one above.
            </p>
          ) : (
            <div className="space-y-3">
              {threads.map((t) => (
                <Link
                  key={t.other_user_id}
                  href={`/messages/${t.other_user_id}`}
                  className="block rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors"
                >
                  <p className="text-sm text-foreground">
                    Chat with user: {t.other_user_id.slice(0, 6)}...
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {t.last_message}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(t.last_at).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
