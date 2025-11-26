import Navbar from "@/app/components/Navbar";
import DashboardFeed from "./DashboardFeed";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Community feed</h1>
        <p className="text-slate-400 text-sm">
          Post updates and see what others are talking about.
        </p>
        <DashboardFeed />
      </main>
    </>
  );
}
