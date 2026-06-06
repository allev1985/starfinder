"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Character, Spaceship } from "@/db/schema";

type Props = {
  campaignId: string;
  campaignName: string;
  isDm: boolean;
  joinCode: string;
  characters: Character[];
  spaceships: Spaceship[];
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="uppercase"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.12em",
        color: "var(--text-3)",
        marginTop: 16,
        marginBottom: 4,
        padding: "0 10px",
      }}
    >
      {children}
    </p>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className="flex items-center gap-[7px] transition-colors"
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: "13.5px",
        fontWeight: active ? 600 : 400,
        color: active ? "var(--accent-text)" : "var(--text-2)",
        backgroundColor: active ? "var(--accent-bg)" : "transparent",
        padding: "9px 10px",
        borderRadius: "var(--r-sm)",
      }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface-2)"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
    >
      {active && (
        <span
          className="shrink-0 rounded-full"
          style={{ width: 7, height: 7, backgroundColor: "var(--sf-accent)" }}
        />
      )}
      {label}
    </Link>
  );
}

export default function CampaignSidebar({
  campaignId,
  campaignName,
  isDm,
  joinCode,
  characters,
  spaceships,
}: Props) {
  return (
    <aside
      className="hidden md:flex w-[240px] shrink-0 flex-col"
      style={{ backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <Link
          href={`/dashboard/campaigns/${campaignId}`}
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 600,
            fontSize: 14,
            color: "var(--text-1)",
            display: "block",
            lineHeight: 1.3,
          }}
        >
          {campaignName}
        </Link>
        {isDm && (
          <p
            className="mt-1"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}
          >
            {joinCode}
          </p>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <SectionLabel>Campaign</SectionLabel>
        <NavItem href={`/dashboard/campaigns/${campaignId}`} label="Overview" />

        <SectionLabel>Characters</SectionLabel>
        {characters.length === 0 ? (
          <p className="px-[10px] text-xs" style={{ color: "var(--text-3)" }}>None yet</p>
        ) : (
          characters.map((character) => (
            <NavItem
              key={character.id}
              href={`/dashboard/campaigns/${campaignId}/characters/${character.id}`}
              label={character.name}
            />
          ))
        )}

        <SectionLabel>Starship</SectionLabel>
        {spaceships.length === 0 ? (
          isDm ? null : (
            <p className="px-[10px] text-xs" style={{ color: "var(--text-3)" }}>None yet</p>
          )
        ) : (
          spaceships.map((ship) => (
            <NavItem
              key={ship.id}
              href={`/dashboard/campaigns/${campaignId}/spaceship/${ship.id}`}
              label={ship.name}
            />
          ))
        )}
        {isDm && (
          <NavItem
            href={`/dashboard/campaigns/${campaignId}/spaceship/new`}
            label="+ Add ship"
          />
        )}
      </nav>
    </aside>
  );
}
