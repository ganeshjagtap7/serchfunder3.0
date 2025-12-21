"use client";

import { useEffect, useRef } from "react";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  created_at: string;
  seen_at: string | null;
  shared_post?: {
    id: string;
    content: string;
    author_name: string;
    author_username: string;
    author_avatar: string | null;
    created_at: string;
  } | null;
}

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
}

export default function MessageThread({ messages, currentUserId, otherUserName, otherUserAvatar }: MessageThreadProps) {
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

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
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
          <p className="text-slate-500 text-sm">Start a conversation</p>
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

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-3 mb-4 ${isOutgoing ? "ml-auto justify-end max-w-[85%]" : "max-w-[85%]"}`}
              >
                {!isOutgoing && (
                  <div className="bg-slate-200 rounded-full size-10 shrink-0 mb-1 overflow-hidden">
                    {otherUserAvatar ? (
                      <img src={otherUserAvatar} alt={otherUserName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600 font-bold text-lg uppercase">
                        {otherUserName?.[0] || "?"}
                      </div>
                    )}
                  </div>
                )}

                <div className={`flex flex-col gap-1 ${isOutgoing ? "items-end" : ""}`}>
                  {msg.message_type === "post" && msg.shared_post ? (
                    <div className="bg-slate-100 p-4 rounded-3xl rounded-bl-none border border-slate-200">
                      <p className="text-slate-900 text-[15px] mb-3 px-1">Thought this might be relevant to our discussion:</p>
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
                        <div className="p-4 flex items-start gap-3">
                          <div className="bg-slate-200 rounded-full size-9 shrink-0 overflow-hidden">
                            {msg.shared_post.author_avatar ? (
                              <img
                                src={msg.shared_post.author_avatar}
                                alt={msg.shared_post.author_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600 font-bold text-sm uppercase">
                                {msg.shared_post.author_name?.[0] || "?"}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-sm mb-1">
                              <span className="font-bold text-slate-900">{msg.shared_post.author_name}</span>
                              <span className="text-slate-500">{msg.shared_post.author_username}</span>
                              <span className="text-slate-500">·</span>
                              <span className="text-slate-500">{formatTime(msg.shared_post.created_at)}</span>
                            </div>
                            <p className="text-sm text-slate-900 leading-snug">{msg.shared_post.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`px-5 py-3 text-[15px] leading-relaxed ${
                        isOutgoing
                          ? "bg-primary text-white rounded-3xl rounded-br-none shadow-sm"
                          : "bg-slate-100 text-slate-900 rounded-3xl rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  )}
                  <span className={`text-xs text-slate-500 ${isOutgoing ? "mr-1" : "ml-1"}`}>
                    {formatTime(msg.created_at)}
                    {isOutgoing && msg.seen_at && " • Seen"}
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
