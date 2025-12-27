interface SavedPostsHeaderProps {
  username: string;
}

export default function SavedPostsHeader({ username }: SavedPostsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-[#0d121b] flex items-center gap-2">
          <span className="material-symbols-outlined text-primary filled">
            bookmark
          </span>
          Saved Posts
        </h1>
        <p className="text-[#4c669a] text-sm mt-1">
          Manage your bookmarked insights and opportunities
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative group">
          <button className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-[#e7ebf3] hover:bg-gray-200 px-4 transition-colors">
            <span className="text-[#0d121b] text-sm font-medium">
              Recently Saved
            </span>
            <span className="material-symbols-outlined text-sm">
              expand_more
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
