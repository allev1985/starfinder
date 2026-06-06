export const dynamic = 'force-dynamic';

import { AppBarProvider } from "@/components/app-bar-context";
import AppBar from "@/components/app-bar";
import TabBar from "@/components/tab-bar";
import TopBar from "./_components/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppBarProvider>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--bg)" }}>
        <TopBar />
        <AppBar />
        <main className="flex flex-1 flex-col pt-[56px] pb-[68px] md:pt-0 md:pb-0">
          {children}
        </main>
        <TabBar />
      </div>
    </AppBarProvider>
  );
}
