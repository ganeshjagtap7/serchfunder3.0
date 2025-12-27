export default function RightSidebar() {
  return (
    <aside className="hidden lg:block lg:col-span-3 space-y-6">
      {/* Trending Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
        <h3 className="text-lg font-bold text-[#0d121b] mb-4">
          Trending for you
        </h3>
        <div className="flex flex-col gap-5">
          {/* Trending Item 1 */}
          <div className="flex flex-col gap-1 cursor-pointer group">
            <div className="flex justify-between items-center text-xs text-[#4c669a]">
              <span>ETA • Trending</span>
              <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
                more_horiz
              </span>
            </div>
            <p className="font-bold text-[#0d121b] text-sm group-hover:text-primary transition-colors">
              #SelfFundedSearch
            </p>
            <p className="text-xs text-[#4c669a]">2.4k Posts</p>
          </div>

          {/* Trending Item 2 */}
          <div className="flex flex-col gap-1 cursor-pointer group">
            <div className="flex justify-between items-center text-xs text-[#4c669a]">
              <span>Finance • Trending</span>
              <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
                more_horiz
              </span>
            </div>
            <p className="font-bold text-[#0d121b] text-sm group-hover:text-primary transition-colors">
              Interest Rates
            </p>
            <p className="text-xs text-[#4c669a]">12.1k Posts</p>
          </div>

          {/* Trending Item 3 */}
          <div className="flex flex-col gap-1 cursor-pointer group">
            <div className="flex justify-between items-center text-xs text-[#4c669a]">
              <span>SaaS • Trending</span>
              <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
                more_horiz
              </span>
            </div>
            <p className="font-bold text-[#0d121b] text-sm group-hover:text-primary transition-colors">
              Multiple Compression
            </p>
            <p className="text-xs text-[#4c669a]">5.6k Posts</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <a className="text-primary text-sm font-medium hover:underline" href="#">
            Show more
          </a>
        </div>
      </div>

      {/* Who to Follow */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-[420px]">
        <h3 className="text-lg font-bold text-[#0d121b] mb-4">
          Who to follow
        </h3>
        <div className="flex flex-col gap-4">
          {/* User 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="size-9 rounded-full bg-cover bg-center bg-gray-200"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAi1VPcJpImIDIIBtF21xwaaVAuyWy7lJLtx4SBMXStiWfIMrLk1VDT6GkkyS-JrSCV5FVSf-Ys6Q7Je4sFStpRJEveINoDQ4sdA9CpuFTlqj4SykASzSP0pXla4jV3adGl-VmEbBPCWzzUKDW_6VZIUcST0KsFW8lNeaSJLu4x0viKEG_y1zz0pa2f5ERpLsnyUjBbaY_b8YF98S-m8wvM1Qgys2GtBkLG0zVWoGHYpzSp5OX5MBXgRBRrwAqL6DEZUj2p0laFuJs')",
                }}
              />
              <div className="flex flex-col">
                <p className="text-sm font-bold text-[#0d121b] hover:underline cursor-pointer">
                  Alex Hormozi
                </p>
                <p className="text-xs text-[#4c669a]">@hormozi</p>
              </div>
            </div>
            <button className="bg-[#0d121b] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90">
              Follow
            </button>
          </div>

          {/* User 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="size-9 rounded-full bg-cover bg-center bg-gray-200"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWqH6gxkRTKfgg8dm2aSq-Fbe4H6tDJm3Ui8oPjj6gWuNHob1FozIORKgsq4cy-QrA2m8s8f-g_9Djm7py3n3mnID2fzWoOu_a2B9ozx2mDjcdQ9u5883wAldAPOvosmN8uY2nJG2RQ2xN32vjnFxhzTtBGkDqcWMGkZQmO1iBXQxKx3NezlFDkRmuaNf3Xhjwge0pfglRfHyhl6jDWeI8M1BnB7NUUT7KqS1poByz1iZWAaomZcdwmYv0r0ACzL1Y-__MQxF-yuY')",
                }}
              />
              <div className="flex flex-col">
                <p className="text-sm font-bold text-[#0d121b] hover:underline cursor-pointer">
                  SMB Law
                </p>
                <p className="text-xs text-[#4c669a]">@smb_attorney</p>
              </div>
            </div>
            <button className="bg-[#0d121b] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90">
              Follow
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
