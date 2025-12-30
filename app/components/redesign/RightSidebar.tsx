"use client";

export default function RightSidebar() {
  const trendingTopics = [
    { category: "Business", tag: "Trending", title: "SBA 7(a) Changes", posts: "2,453 posts" },
    { category: "Industry", tag: "Trending", title: "HVAC Rollups", posts: "1,200 posts" },
    { category: "Conference", tag: "Live", title: "EtA Summit 2024", posts: "540 posts" },
  ];

  const suggestedUsers = [
    {
      name: "Acme Capital",
      handle: "@acmecap",
      initials: "AC",
      color: "green"
    },
    {
      name: "Sarah Blake",
      handle: "@sblake_law",
      initials: "SB",
      color: "blue"
    },
  ];

  return (
    <aside className="hidden lg:block lg:col-span-3 space-y-6">
      {/* Search */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2.5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-primary focus-within:bg-white dark:focus-within:bg-slate-900 border border-transparent focus-within:border-primary transition-all">
        <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary">search</span>
        <input
          type="text"
          placeholder="Search InsideAquisitions"
          className="bg-transparent border-none focus:ring-0 p-0 text-sm w-full text-slate-900 dark:text-white placeholder-slate-500"
        />
      </div>

      {/* What's happening */}
      <div className="card-dark rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">What's happening</h3>
        <div className="space-y-4">
          {trendingTopics.map((topic, idx) => (
            <div
              key={idx}
              className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-4 px-4 py-2 transition-colors"
            >
              <p className="text-xs text-slate-500">{topic.category} • {topic.tag}</p>
              <p className="font-bold text-slate-900 dark:text-white">{topic.title}</p>
              <p className="text-xs text-slate-500">{topic.posts}</p>
            </div>
          ))}
        </div>
        <button className="text-primary text-sm mt-4 hover:underline">
          Show more
        </button>
      </div>

      {/* Who to follow */}
      <div className="card-dark rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Who to follow</h3>
        <div className="space-y-4">
          {suggestedUsers.map((user, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`size-10 ${
                  user.color === 'green'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                } rounded-full flex items-center justify-center font-bold text-xs`}>
                  {user.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user.handle}</p>
                </div>
              </div>
              <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
