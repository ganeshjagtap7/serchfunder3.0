import Navbar from "@/app/components/Navbar";
import DashboardFeed from "./DashboardFeed";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Icons } from "@/app/components/ui/Icons";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar (Navigation) */}
          <aside className="hidden md:block md:col-span-3 space-y-4">
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

          {/* Main Feed */}
          <main className="col-span-12 md:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Community Feed</h1>
              <Button size="sm" className="gap-2">
                <Icons.Plus className="h-4 w-4" />
                New Post
              </Button>
            </div>
            <DashboardFeed />
          </main>
        </div>
      </div>
    </div>
  );
}
