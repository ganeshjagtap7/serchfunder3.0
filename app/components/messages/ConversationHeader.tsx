"use client";

interface ConversationHeaderProps {
  name: string;
  username: string;
  avatarUrl: string | null;
}

export default function ConversationHeader({ name, username, avatarUrl }: ConversationHeaderProps) {
  return (
    <header className="h-[60px] px-6 flex items-center justify-between border-b border-slate-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="bg-slate-200 rounded-full size-10 cursor-pointer overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600 font-bold text-lg uppercase">
              {name?.[0] || "?"}
            </div>
          )}
        </div>
        <div className="flex flex-col cursor-pointer">
          <span className="font-bold text-slate-900 text-[17px] leading-tight">{name}</span>
          <span className="text-sm text-slate-500 leading-tight">{username}</span>
        </div>
      </div>
      <button
        className="p-2 rounded-full hover:bg-slate-100 text-slate-900 transition-colors"
        title="Conversation Details"
      >
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 500" }}>
          info
        </span>
      </button>
    </header>
  );
}
