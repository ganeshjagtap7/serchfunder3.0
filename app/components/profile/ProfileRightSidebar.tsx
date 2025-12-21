"use client";

export default function ProfileRightSidebar() {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">Portfolio Highlights</h3>
        <div className="flex flex-col gap-4">
          <div className="text-center py-8 text-slate-500 text-sm">
            No portfolio data available
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">Who to follow</h3>
        <div className="flex flex-col gap-4">
          <div className="text-center py-8 text-slate-500 text-sm">
            No suggestions available
          </div>
        </div>
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
        <span>© 2024 Searchfunder Inc.</span>
      </div>
    </>
  );
}
