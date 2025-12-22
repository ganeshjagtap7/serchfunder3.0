"use client";

import { useEffect, useRef } from "react";

interface GroupMessage {
  id: string;
  sender_id: string;
  group_id: string;
  content: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface GroupMessageThreadProps {
  messages: GroupMessage[];
  currentUserId: string;
}

export default function GroupMessageThread({ messages, currentUserId }: GroupMessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const groupMessagesByDate = (messages: GroupMessage[]) => {
    const groups: { date: string; messages: GroupMessage[] }[] = [];
    let currentDate = "";

    messages.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toLocaleDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: formatDate(msg.created_at), messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 text-sm">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col">
      {messageGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <div className="flex justify-center my-4">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {group.date}
            </span>
          </div>

          {group.messages.map((msg) => {
            const isOutgoing = msg.sender_id === currentUserId;
            const senderName = msg.sender?.full_name || "Unknown";
            const senderAvatar = msg.sender?.avatar_url;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-3 mb-4 ${isOutgoing ? "ml-auto justify-end max-w-[85%]" : "max-w-[85%]"}`}
              >
                {!isOutgoing && (
                  <div className="bg-slate-200 rounded-full size-10 shrink-0 mb-1 overflow-hidden group relative">
                    {senderAvatar ? (
                      <img src={senderAvatar} alt={senderName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600 font-bold text-sm uppercase">
                        {senderName[0] || "?"}
                      </div>
                    )}
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/75 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                      {senderName}
                    </div>
                  </div>
                )}

                <div className={`flex flex-col gap-1 ${isOutgoing ? "items-end" : ""}`}>
                  {!isOutgoing && (
                    <span className="text-[10px] text-slate-500 ml-1">{senderName}</span>
                  )}

                  <div
                    className={`px-5 py-3 text-[15px] leading-relaxed ${isOutgoing
                        ? "bg-primary text-white rounded-3xl rounded-br-none shadow-sm"
                        : "bg-slate-100 text-slate-900 rounded-3xl rounded-bl-none"
                      }`}
                  >
                    {msg.content}
                  </div>

                  <span className={`text-xs text-slate-500 ${isOutgoing ? "mr-1" : "ml-1"}`}>
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
