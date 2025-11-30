"use client";

import { useState, useTransition } from "react";

type Props = {
  groupId: string;
  isMemberInitially: boolean;
};

export default function GroupMembershipButton({ groupId, isMemberInitially }: Props) {
  const [isMember, setIsMember] = useState(isMemberInitially);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleJoin = () => {
    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/group-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to join group");
        return;
      }

      setIsMember(true);
    });
  };

  const handleLeave = () => {
    startTransition(async () => {
      setError(null);
      const res = await fetch(`/api/group-members?groupId=${groupId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to leave group");
        return;
      }

      setIsMember(false);
    });
  };

  const loadingText = isMember ? "Leaving..." : "Joining...";
  const buttonText = isMember ? "Leave group" : "Join group";
  const onClick = isMember ? handleLeave : handleJoin;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <button
        onClick={onClick}
        disabled={isPending}
        className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
      >
        {isPending ? loadingText : buttonText}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
