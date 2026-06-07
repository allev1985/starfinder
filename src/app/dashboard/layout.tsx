export const dynamic = 'force-dynamic';

import { AppBarProvider } from "@/components/app-bar-context";
import AppBar from "@/components/app-bar";
import TabBar from "@/components/tab-bar";
import TopBar from "./_components/top-bar";
import { getUser, isAdmin } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const admin = isAdmin(user);

  return (
    <AppBarProvider>
      <div className="flex h-dvh flex-col" style={{ backgroundColor: "var(--bg)" }}>
        <TopBar isAdmin={admin} />
        <AppBar />
        <div className="shrink-0 h-[56px] md:h-[54px]" aria-hidden="true" />
        <main className="flex flex-1 min-h-0 flex-col overflow-y-auto overscroll-y-contain pb-[68px] md:pb-0">
          {children}
        </main>
        <TabBar />
      </div>
    </AppBarProvider>
  );
}
