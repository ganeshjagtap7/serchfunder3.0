import { ReactNode } from "react";

interface DashboardLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export default function DashboardLayout({ left, center, right }: DashboardLayoutProps) {
  return (
    <main className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 px-4 py-6">
      {/* LEFT */}
      <aside className="hidden md:block md:col-span-3">
        {left}
      </aside>

      {/* CENTER */}
      <section className="md:col-span-9 lg:col-span-6">
        {center}
      </section>

      {/* RIGHT */}
      <aside className="hidden lg:block lg:col-span-3">
        {right}
      </aside>
    </main>
  );
}
