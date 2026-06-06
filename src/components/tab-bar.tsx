"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Building2, Users, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAppBar } from "./app-bar-context";

export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { campaign } = useAppBar();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const tabs = [
    {
      label: "Home",
      icon: Home,
      href: "/dashboard",
      match: (p: string) => p === "/dashboard",
    },
    {
      label: "Campaign",
      icon: Building2,
      href: campaign.campaignId
        ? `/dashboard/campaigns/${campaign.campaignId}`
        : "/dashboard/campaigns",
      match: (p: string) =>
        campaign.campaignId
          ? p.startsWith(`/dashboard/campaigns/${campaign.campaignId}`) && !p.includes("/spaceship")
          : p.startsWith("/dashboard/campaigns"),
    },
    {
      label: "Characters",
      icon: Users,
      href: "/dashboard/characters",
      match: (p: string) => p.startsWith("/dashboard/characters"),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${tabs.length}, 1fr) 1fr`,
        height: 68,
        paddingBottom: "env(safe-area-inset-bottom)",
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {tabs.map(({ label, icon: Icon, href, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center justify-center gap-[3px]"
            style={{ color: active ? "var(--sf-accent)" : "var(--text-3)" }}
          >
            <Icon size={22} />
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 10 }}>
              {label}
            </span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={handleSignOut}
        className="flex flex-col items-center justify-center gap-[3px]"
        style={{ color: "var(--text-3)" }}
      >
        <LogOut size={22} />
        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 10 }}>
          Sign Out
        </span>
      </button>
    </nav>
  );
}
