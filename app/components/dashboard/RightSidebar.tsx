"use client";

export default function RightSidebar() {
  return (
    <aside className="space-y-6">
      {/* Search */}
      <div className="bg-slate-100 rounded-full px-4 py-2.5 flex items-center gap-2 group border border-transparent">
        <span className="material-symbols-outlined text-slate-500">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 p-0 text-sm w-full text-slate-900 placeholder-slate-500"
          placeholder="Search InsideAquisitions"
          type="text"
        />
      </div>

      {/* What's happening */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900">
          What's happening
        </h3>
        <div className="space-y-4">
          <div className="cursor-pointer -mx-4 px-4 py-2 hover:bg-slate-50 transition-colors">
            <p className="text-xs text-slate-500">Business • Trending</p>
            <p className="font-bold text-slate-900">SBA 7(a) Changes</p>
            <p className="text-xs text-slate-500">2,453 posts</p>
          </div>
          <div className="cursor-pointer -mx-4 px-4 py-2 hover:bg-slate-50 transition-colors">
            <p className="text-xs text-slate-500">Industry • Trending</p>
            <p className="font-bold text-slate-900">HVAC Rollups</p>
            <p className="text-xs text-slate-500">1,200 posts</p>
          </div>
          <div className="cursor-pointer -mx-4 px-4 py-2 hover:bg-slate-50 transition-colors">
            <p className="text-xs text-slate-500">Conference • Live</p>
            <p className="font-bold text-slate-900">EtA Summit 2024</p>
            <p className="text-xs text-slate-500">540 posts</p>
          </div>
        </div>
        <button className="text-primary text-sm mt-4 hover:underline">
          Show more
        </button>
      </div>

      {/* Who to follow */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900">
          Who to follow
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                AC
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">
                  Acme Capital
                </p>
                <p className="text-xs text-slate-500">@acmecap</p>
              </div>
            </div>
            <button className="bg-slate-900 text-white text-sm font-bold px-4 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
              Follow
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                SB
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">
                  Sarah Blake
                </p>
                <p className="text-xs text-slate-500">@sblake_law</p>
              </div>
            </div>
            <button className="bg-slate-900 text-white text-sm font-bold px-4 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
              Follow
            </button>
          </div>
        </div>
        <button className="text-primary text-sm mt-4 hover:underline">
          Show more
        </button>
      </div>
    </aside>
  );
}
