"use client";

import { useState } from "react";
import Link from "next/link";

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  stats: {
    comments: number;
    reposts: number;
    likes: number;
  };
  liked?: boolean;
  reposted?: boolean;
}

export default function HomePage() {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "John Smith",
        username: "johnsmith_cap",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWDPVY2Trj45c2vwXF1Zl0xO6Lct2t3d9XdtvhQ6ZoGgKp1JCVDtQJyiugQ9UNkihi6imY6T_srUY8MbbNFzz7Sb9eo_NNvldwfxVR5seVmR6ZT4c4MMy0_qK32JeR0G3h42YZ0_HRuiJRBXGaiv0S62H5q6khApA8zH1ni_HsylgZuNNPChKx4HtVG8okqsqj_sdN6g3l4jmAOzWNxL_PneEBVSqfeqkytRR9Ri-H5YfzE-DNWzXwih8g3NFzjn_6eQ6PNeBfp0c",
        verified: true,
      },
      content:
        "Just closed a deal on a manufacturing plant in Texas. The due diligence process was intense, but the cash flow potential is incredible. Huge thanks to the Searchfunder community for the referral to the lender! 🏭 📈 #SearchFund #EtA",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ58v51aqim_m4kusnSU0xIU1zPjq8mOQEus-fVU7vhlYeEdOXJ7RGmleW0ohHkjsOBI8MCsTi57Cd3vCMP2K6OwRBdavrTAXZ__PmKsU7IHBgI15CwBpAIJ1oMpNgb4Eqa1WRCbyRbmp3anfkjizxsVTnGnlpqt5yZZqztGh3ME156uYs_g6MD7HTR1Li1QCUAzQ5GoYHtRbjyXUTa38qr2aTAR8xvtGf5lPCf7VmcvW_ywLCGaAfUK87tnDD36ihFAE2GuMk4d0",
      timestamp: "2h",
      stats: {
        comments: 24,
        reposts: 5,
        likes: 142,
      },
    },
    {
      id: "2",
      author: {
        name: "Searchfunder Official",
        username: "team",
        avatar: "",
        verified: true,
      },
      content:
        "We've just updated our guide on self-funded search terms. Check out the latest benchmarks for seller notes and SBA financing structures in the Resources tab. 📚",
      timestamp: "5h",
      stats: {
        comments: 8,
        reposts: 12,
        likes: 56,
      },
    },
    {
      id: "3",
      author: {
        name: "David Chen",
        username: "dchen_search",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwF0fkvupAHbkIHJ1t9wiJCyLmJ5UKqYxBJfhmoG559dG5hydVeokyKiNNYXfRXTy_Hlr1AT37jsohi57TpG9W-wghKYGduQ_pTODuRVqpGDfDd69-Ry2FHXofBY1HqU2-QnDBvMmKLX0uyzyPmO6Cz09rB_isSXkxMTFMagDeI9gboZKmQj1rdzpq0rG1ea6i5jQa0G14b9L10v6Wac7H0KdqfgyWG-sGBW5bgm8gEPo1QqXAeRVvDG7_B43OqD5cw1Jfe6Pkpbw",
        verified: false,
      },
      content:
        "Anyone have recommendations for quality of earnings providers who specialize in healthcare services? Dealing with a tricky revenue recognition issue.",
      timestamp: "8h",
      stats: {
        comments: 32,
        reposts: 1,
        likes: 15,
      },
    },
  ]);

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: "Jane Doe",
        username: "janedoe_investor",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfI1CmM3bN7XtTqgDgWLT4WgqCGmkqB1gLCal3VR6qrcf0V_T4MqDW2IjjJZL9o7QOnSmWlufYhAKt7HBhneuOAdFDC8L0pg-HaHZx0STwSHi_kYzxILGpJvbey0_h-L0XM32by8KNdFVYkU_8GlbfafjybWOqngVr9cUM0R7xvhw1IjDS_WwWEZPp0sdiAvz5TznpXt8SGTmFHvIozirDXQWs2u31KOgeJqAvfbGSMnubePMmBoOsxmg1alF_IJWT2rfTu3vcayM",
        verified: false,
      },
      content: newPost,
      timestamp: "now",
      stats: {
        comments: 0,
        reposts: 0,
        likes: 0,
      },
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              stats: {
                ...post.stats,
                likes: post.liked ? post.stats.likes - 1 : post.stats.likes + 1,
              },
            }
          : post
      )
    );
  };

  const handleRepost = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reposted: !post.reposted,
              stats: {
                ...post.stats,
                reposts: post.reposted
                  ? post.stats.reposts - 1
                  : post.stats.reposts + 1,
              },
            }
          : post
      )
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200/80 dark:border-slate-800/80 bg-background/95 backdrop-blur-sm px-4 md:px-10 py-3">
              <div className="flex items-center gap-4">
                <div className="size-8 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h2 className="hidden md:block text-xl font-bold leading-tight tracking-[-0.015em]">
                  Searchfunder
                </h2>
              </div>
              <div className="flex flex-1 justify-center md:justify-end items-center gap-8">
                <nav className="flex items-center gap-2 md:gap-6">
                  <Link
                    href="/"
                    className="flex flex-col items-center gap-1 text-primary p-2 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      home
                    </span>
                    <span className="hidden md:block text-xs font-semibold">Feed</span>
                  </Link>
                  <Link
                    href="/explore"
                    className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">search</span>
                    <span className="hidden md:block text-xs font-medium">Explore</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="hidden md:block text-xs font-medium">Notifications</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">person</span>
                    <span className="hidden md:block text-xs font-medium">Profile</span>
                  </Link>
                </nav>
                <div className="hidden md:flex gap-3 items-center ml-4 border-l border-slate-200 dark:border-slate-800 pl-4">
                  <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <img
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfI1CmM3bN7XtTqgDgWLT4WgqCGmkqB1gLCal3VR6qrcf0V_T4MqDW2IjjJZL9o7QOnSmWlufYhAKt7HBhneuOAdFDC8L0pg-HaHZx0STwSHi_kYzxILGpJvbey0_h-L0XM32by8KNdFVYkU_8GlbfafjybWOqngVr9cUM0R7xvhw1IjDS_WwWEZPp0sdiAvz5TznpXt8SGTmFHvIozirDXQWs2u31KOgeJqAvfbGSMnubePMmBoOsxmg1alF_IJWT2rfTu3vcayM"
                    />
                  </div>
                  <button
                    onClick={handlePostSubmit}
                    className="bg-primary text-white rounded-full px-5 py-2 text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6 md:pt-8">
              {/* Left Sidebar */}
              <aside className="hidden md:block md:col-span-3 lg:col-span-3 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  <div className="h-24 bg-primary/10 w-full relative">
                    <div className="absolute -bottom-10 left-4 p-1 bg-white dark:bg-slate-900 rounded-full">
                      <img
                        alt="Profile"
                        className="size-20 rounded-full object-cover bg-slate-200"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfI1CmM3bN7XtTqgDgWLT4WgqCGmkqB1gLCal3VR6qrcf0V_T4MqDW2IjjJZL9o7QOnSmWlufYhAKt7HBhneuOAdFDC8L0pg-HaHZx0STwSHi_kYzxILGpJvbey0_h-L0XM32by8KNdFVYkU_8GlbfafjybWOqngVr9cUM0R7xvhw1IjDS_WwWEZPp0sdiAvz5TznpXt8SGTmFHvIozirDXQWs2u31KOgeJqAvfbGSMnubePMmBoOsxmg1alF_IJWT2rfTu3vcayM"
                      />
                    </div>
                  </div>
                  <div className="pt-12 px-5 pb-5">
                    <h3 className="font-bold text-lg">Jane Doe</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">@janedoe_investor</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                      Active Searcher | MBA | Looking for B2B SaaS in the Midwest.
                    </p>
                    <div className="flex gap-4 mt-4 text-sm">
                      <div>
                        <span className="font-bold">420</span>{" "}
                        <span className="text-slate-500">Following</span>
                      </div>
                      <div>
                        <span className="font-bold">892</span>{" "}
                        <span className="text-slate-500">Followers</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-sm">
                  <nav className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary font-medium"
                    >
                      <span className="material-symbols-outlined">rss_feed</span> Latest Activity
                    </Link>
                    <Link
                      href="/saved"
                      className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                    >
                      <span className="material-symbols-outlined">bookmark</span> Saved Posts
                    </Link>
                    <Link
                      href="/groups"
                      className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                    >
                      <span className="material-symbols-outlined">group</span> My Communities
                    </Link>
                    <Link
                      href="/dealflow"
                      className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                    >
                      <span className="material-symbols-outlined">trending_up</span> Deal Flow
                    </Link>
                  </nav>
                </div>
              </aside>

              {/* Center Feed */}
              <section className="md:col-span-9 lg:col-span-6 space-y-5">
                {/* New Post Box */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex gap-4">
                    <img
                      alt="User"
                      className="size-10 rounded-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfI1CmM3bN7XtTqgDgWLT4WgqCGmkqB1gLCal3VR6qrcf0V_T4MqDW2IjjJZL9o7QOnSmWlufYhAKt7HBhneuOAdFDC8L0pg-HaHZx0STwSHi_kYzxILGpJvbey0_h-L0XM32by8KNdFVYkU_8GlbfafjybWOqngVr9cUM0R7xvhw1IjDS_WwWEZPp0sdiAvz5TznpXt8SGTmFHvIozirDXQWs2u31KOgeJqAvfbGSMnubePMmBoOsxmg1alF_IJWT2rfTu3vcayM"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-lg resize-none placeholder-slate-400"
                        placeholder="What's happening in your search?"
                        rows={2}
                      />
                      <div className="border-t border-slate-100 dark:border-slate-800 mt-3 pt-3 flex items-center justify-between">
                        <div className="flex gap-2 text-primary">
                          <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                            <span className="material-symbols-outlined !text-[20px]">image</span>
                          </button>
                          <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                            <span className="material-symbols-outlined !text-[20px]">gif_box</span>
                          </button>
                          <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                            <span className="material-symbols-outlined !text-[20px]">poll</span>
                          </button>
                          <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                            <span className="material-symbols-outlined !text-[20px]">
                              sentiment_satisfied
                            </span>
                          </button>
                        </div>
                        <button
                          onClick={handlePostSubmit}
                          disabled={!newPost.trim()}
                          className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-1.5 px-4 rounded-full text-sm transition-colors"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Posts Feed */}
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        {post.author.avatar ? (
                          <img
                            alt="Avatar"
                            className="size-10 rounded-full object-cover"
                            src={post.author.avatar}
                          />
                        ) : (
                          <div className="flex-shrink-0 size-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">
                            SF
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <span className="font-bold truncate">{post.author.name}</span>
                            {post.author.verified && (
                              <span
                                className="material-symbols-outlined text-primary !text-[16px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                verified
                              </span>
                            )}
                            <span className="text-slate-500 text-sm truncate">
                              @{post.author.username} · {post.timestamp}
                            </span>
                          </div>
                          <button className="text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">more_horiz</span>
                          </button>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap">{post.content}</p>
                        {post.image && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                            <img
                              alt="Post Image"
                              className="w-full h-64 object-cover"
                              src={post.image}
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3 max-w-md">
                          <button className="group flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors">
                            <div className="p-1.5 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                              <span className="material-symbols-outlined !text-[18px]">
                                chat_bubble
                              </span>
                            </div>
                            <span className="text-sm">{post.stats.comments}</span>
                          </button>
                          <button
                            onClick={() => handleRepost(post.id)}
                            className={`group flex items-center gap-1.5 transition-colors ${
                              post.reposted
                                ? "text-green-500"
                                : "text-slate-500 hover:text-green-500"
                            }`}
                          >
                            <div className="p-1.5 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/30">
                              <span className="material-symbols-outlined !text-[18px]">repeat</span>
                            </div>
                            <span className="text-sm">{post.stats.reposts}</span>
                          </button>
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`group flex items-center gap-1.5 transition-colors ${
                              post.liked ? "text-red-500" : "text-slate-500 hover:text-red-500"
                            }`}
                          >
                            <div className="p-1.5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/30">
                              <span
                                className="material-symbols-outlined !text-[18px]"
                                style={{
                                  fontVariationSettings: post.liked ? "'FILL' 1" : "'FILL' 0",
                                }}
                              >
                                favorite
                              </span>
                            </div>
                            <span className="text-sm">{post.stats.likes}</span>
                          </button>
                          <button className="group flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                            <div className="p-1.5 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                              <span className="material-symbols-outlined !text-[18px]">
                                ios_share
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              {/* Right Sidebar */}
              <aside className="hidden lg:block lg:col-span-3 space-y-6">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2.5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-primary focus-within:bg-white dark:focus-within:bg-slate-900 border border-transparent focus-within:border-primary transition-all">
                  <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary">
                    search
                  </span>
                  <input
                    className="bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-sm w-full placeholder-slate-500"
                    placeholder="Search Searchfunder"
                    type="text"
                  />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">What&apos;s happening</h3>
                  <div className="space-y-4">
                    <div className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-4 px-4 py-2 transition-colors">
                      <p className="text-xs text-slate-500">Business • Trending</p>
                      <p className="font-bold">SBA 7(a) Changes</p>
                      <p className="text-xs text-slate-500">2,453 posts</p>
                    </div>
                    <div className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-4 px-4 py-2 transition-colors">
                      <p className="text-xs text-slate-500">Industry • Trending</p>
                      <p className="font-bold">HVAC Rollups</p>
                      <p className="text-xs text-slate-500">1,200 posts</p>
                    </div>
                    <div className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-4 px-4 py-2 transition-colors">
                      <p className="text-xs text-slate-500">Conference • Live</p>
                      <p className="font-bold">EtA Summit 2024</p>
                      <p className="text-xs text-slate-500">540 posts</p>
                    </div>
                  </div>
                  <button className="text-primary text-sm mt-4 hover:underline">Show more</button>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Who to follow</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="size-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">
                          AC
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">Acme Capital</p>
                          <p className="text-xs text-slate-500 truncate">@acmecap</p>
                        </div>
                      </div>
                      <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90">
                        Follow
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                          SB
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">Sarah Blake</p>
                          <p className="text-xs text-slate-500 truncate">@sblake_law</p>
                        </div>
                      </div>
                      <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90">
                        Follow
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
