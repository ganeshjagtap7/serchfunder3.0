"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

interface MessageComposerProps {
  currentUserId: string;
  receiverId: string;
  onMessageSent: () => void;
}

export default function MessageComposer({ currentUserId, receiverId, onMessageSent }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    setSending(true);

    const { data, error } = await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: receiverId,
      content: message.trim(),
      message_type: "text",
    } as never);

    if (error) {
      console.error("Error sending message:", error);
      alert(`Failed to send message: ${error.message || "Please try again."}`);
    } else {
      setMessage("");
      onMessageSent();
      if (textareaRef.current) {
        textareaRef.current.style.height = "24px";
      }
    }

    setSending(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <footer className="p-4 border-t border-slate-100 bg-white">
      <div className="flex items-end gap-2 bg-slate-100 rounded-3xl p-1.5 px-2 shadow-inner focus-within:ring-2 ring-primary/20 transition-all">
        <div className="flex items-center gap-1 pb-1">
          <button
            className="p-2 rounded-full text-primary hover:bg-blue-100/50 transition-colors"
            title="Upload Image"
          >
            <span className="material-symbols-outlined text-[24px]">image</span>
          </button>
          <button
            className="p-2 rounded-full text-primary hover:bg-blue-100/50 transition-colors"
            title="Add GIF"
          >
            <span className="material-symbols-outlined text-[24px]">gif_box</span>
          </button>
          <button
            className="hidden sm:block p-2 rounded-full text-primary hover:bg-blue-100/50 transition-colors"
            title="Add Emoji"
          >
            <span className="material-symbols-outlined text-[24px]">sentiment_satisfied</span>
          </button>
        </div>

        <div className="flex-1 py-2.5">
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent border-0 p-0 text-slate-900 placeholder-slate-500 focus:ring-0 resize-none max-h-32 text-[16px] leading-relaxed"
            placeholder="Start a new message"
            rows={1}
            style={{ minHeight: "24px" }}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="pb-1">
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="p-2 rounded-full text-primary hover:bg-blue-100/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send Message"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              send
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
