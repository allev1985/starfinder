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

export default function CampaignSidebar({
  campaignId,
  campaignName,
  isDm,
  joinCode,
  characters,
  spaceships,
}: Props) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-muted/30">
      <div className="border-b p-4">
        <Link
          href={`/dashboard/campaigns/${campaignId}`}
          className="block text-sm font-semibold leading-tight hover:text-foreground/80"
        >
          {campaignName}
        </Link>
        {isDm && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {joinCode}
          </p>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Characters
        </p>
        {characters.length === 0 ? (
          <p className="px-2 text-xs text-muted-foreground">None yet</p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {characters.map((character) => {
              const href = `/dashboard/campaigns/${campaignId}/characters/${character.id}`;
              const isActive = pathname === href;
              return (
                <li key={character.id}>
                  <Link
                    href={href}
                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    {character.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-4 mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Spaceships
        </p>
        {spaceships.length === 0 ? (
          isDm ? null : (
            <p className="px-2 text-xs text-muted-foreground">None yet</p>
          )
        ) : (
          <ul className="flex flex-col gap-0.5">
            {spaceships.map((ship) => {
              const href = `/dashboard/campaigns/${campaignId}/spaceship/${ship.id}`;
              const isActive = pathname === href;
              return (
                <li key={ship.id}>
                  <Link
                    href={href}
                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    {ship.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {isDm && (
          <Link
            href={`/dashboard/campaigns/${campaignId}/spaceship/new`}
            className="mt-0.5 block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            + Add ship
          </Link>
        )}
      </nav>
    </aside>
  );
}
