import Navbar from "@/app/components/Navbar";
import DashboardFeed from "./DashboardFeed";
import FeaturedPosts from "./FeaturedPosts";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Icons } from "@/app/components/ui/Icons";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Sidebar (Navigation) */}
          <aside className="hidden lg:block lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-2 space-y-1">
                <Link href="/dashboard" className="block">
                  <Button variant="ghost" className="w-full justify-start font-medium gap-3">
                    <Icons.Home className="h-4 w-4" />
                    Home
                  </Button>
                </Link>
                <Link href="/groups" className="block">
                  <Button variant="ghost" className="w-full justify-start font-medium gap-3">
                    <Icons.Users className="h-4 w-4" />
                    Groups
                  </Button>
                </Link>
                <Link href="/messages" className="block">
                  <Button variant="ghost" className="w-full justify-start font-medium gap-3">
                    <Icons.MessageSquare className="h-4 w-4" />
                    Messages
                  </Button>
                </Link>
                <Link href="/resources" className="block">
                  <Button variant="ghost" className="w-full justify-start font-medium gap-3">
                    <Icons.BookOpen className="h-4 w-4" />
                    Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>

          {/* Center Feed - Centered */}
          <main className="col-span-12 lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Community Feed</h1>
              <Button size="sm" className="gap-2">
                <Icons.Plus className="h-4 w-4" />
                New Post
              </Button>
            </div>
            <div className="w-full">
              <DashboardFeed />
            </div>
          </main>

          {/* Right Sidebar (Featured Posts) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4">
            <Card>
              <CardContent className="p-4">
                <FeaturedPosts />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
