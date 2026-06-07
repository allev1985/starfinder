"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "Campaigns", href: "/dashboard/campaigns" },
  { label: "Characters", href: "/dashboard/characters" },
];

export default function TopBar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header
      className="hidden md:flex fixed top-0 z-50 w-full items-center"
      style={{ height: 54, backgroundColor: "var(--chrome)" }}
    >
      <div className="flex flex-1 items-center gap-6 px-5">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <span
            className="rounded-full shrink-0"
            style={{
              width: 9,
              height: 9,
              backgroundColor: "var(--accent-bright)",
              boxShadow: "0 0 10px var(--accent-bright)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--chrome-text)",
            }}
          >
            Starfinder Campaigns
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="transition-colors"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--chrome-text)" : "var(--chrome-muted)",
                  backgroundColor: active ? "var(--chrome-3)" : "transparent",
                  padding: "5px 12px",
                  borderRadius: "var(--r-sm)",
                }}
              >
                {label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className="transition-colors"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 14,
                fontWeight: pathname.startsWith("/dashboard/admin") ? 600 : 400,
                color: pathname.startsWith("/dashboard/admin") ? "var(--chrome-text)" : "var(--chrome-muted)",
                backgroundColor: pathname.startsWith("/dashboard/admin") ? "var(--chrome-3)" : "transparent",
                padding: "5px 12px",
                borderRadius: "var(--r-sm)",
              }}
            >
              Admin
            </Link>
          )}
        </nav>
      </div>

      {/* Sign out */}
      <div className="px-5">
        <button
          type="button"
          onClick={handleSignOut}
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            color: "var(--chrome-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--chrome-text)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--chrome-muted)"; }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
