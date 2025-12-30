"use client";

export default function ProfileRightSidebar() {
  // TODO: Fetch real portfolio data from investments table
  // Query: SELECT * FROM investments WHERE investor_id = user.id
  // Display: company name, investment date, amount, status
  const portfolioItems = [
    // Placeholder data - replace with real data from database
    { id: 1, company: "TechStart Inc", type: "Series A", amount: "$500K" },
    { id: 2, company: "CleanEnergy Co", type: "Seed", amount: "$250K" },
    { id: 3, company: "SaaS Solutions", type: "Series B", amount: "$1M" },
  ];

  // TODO: Implement intelligent follow suggestions
  // Strategy:
  // 1. Query users with similar interests/roles
  // 2. Find connections of connections (2nd degree)
  // 3. Filter out already following
  // 4. Rank by mutual connections + activity
  // Query: Complex JOIN with follows, profiles, interests tables
  const suggestedUsers = [
    // Placeholder data - replace with recommendation algorithm
    { id: 1, name: "Emily Carter", username: "@emilycarter", role: "Investor", initials: "EC", color: "purple" },
    { id: 2, name: "Michael Chen", username: "@mchen_vc", role: "Fund Manager", initials: "MC", color: "blue" },
    { id: 3, name: "Lisa Williams", username: "@lwilliams", role: "Searcher", initials: "LW", color: "green" },
  ];

  return (
    <>
      {/* Portfolio Highlights */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">Portfolio Highlights</h3>
        <div className="flex flex-col gap-3">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="px-2 py-3 hover:bg-slate-50 rounded-lg cursor-pointer transition border border-slate-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-900">{item.company}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.type} • {item.amount}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
        <button className="text-primary text-sm mt-3 px-2 hover:underline">
          View all investments
        </button>
      </div>

      {/* Who to follow */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">Who to follow</h3>
        <div className="flex flex-col gap-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-2 py-2 hover:bg-slate-50 rounded-lg transition">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-${user.color}-100 flex items-center justify-center text-${user.color}-700 font-bold text-sm`}>
                  {user.initials}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.username}</p>
                </div>
              </div>
              <button className="bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-slate-700 transition">
                Follow
              </button>
            </div>
          ))}
        </div>
        <button className="text-primary text-sm mt-3 px-2 hover:underline">
          Show more
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">Trending in Venture</h3>
        <div className="flex flex-col gap-4">
          <div className="px-2 hover:bg-slate-50 rounded-lg py-2 cursor-pointer transition">
            <p className="text-xs text-slate-500">Business &amp; Finance · Trending</p>
            <p className="font-bold text-sm text-slate-900">Generative AI</p>
            <p className="text-xs text-slate-500">52.4K posts</p>
          </div>
          <div className="px-2 hover:bg-slate-50 rounded-lg py-2 cursor-pointer transition">
            <p className="text-xs text-slate-500">Startups · Trending</p>
            <p className="font-bold text-sm text-slate-900">#SaaSValuations</p>
            <p className="text-xs text-slate-500">12.1K posts</p>
          </div>
          <div className="px-2 hover:bg-slate-50 rounded-lg py-2 cursor-pointer transition">
            <p className="text-xs text-slate-500">Investing · Trending</p>
            <p className="font-bold text-sm text-slate-900">Climate Tech</p>
            <p className="text-xs text-slate-500">8,932 posts</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 text-xs text-slate-500">
        <a className="hover:underline" href="#">Terms of Service</a>
        <a className="hover:underline" href="#">Privacy Policy</a>
        <a className="hover:underline" href="#">Cookie Policy</a>
        <a className="hover:underline" href="#">Accessibility</a>
        <a className="hover:underline" href="#">Ads info</a>
        <span>© 2024 InsideAquisitions Inc.</span>
      </div>
    </>
  );
}
