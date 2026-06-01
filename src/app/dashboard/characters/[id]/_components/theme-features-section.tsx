"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import type { ThemeAbility } from "@/db/schema";

const MILESTONE_LEVELS = [1, 6, 12, 18] as const;

type Props = {
  themeAbilities: ThemeAbility[];
  characterLevel: number;
};

function FeatureDescription({ description }: { description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="text-left text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <ChevronUp className="inline h-3 w-3 mr-1" /> : <ChevronDown className="inline h-3 w-3 mr-1" />}
        {open ? "Hide description" : "Show description"}
      </button>
      {open && (
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      )}
    </div>
  );
}

export default function ThemeFeaturesSection({ themeAbilities, characterLevel }: Props) {
  if (themeAbilities.length === 0) return null;

  const byLevel = themeAbilities.reduce<Record<number, ThemeAbility>>((acc, a) => {
    acc[a.level] = a;
    return acc;
  }, {});

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Theme Features
      </h2>
      <div className="space-y-3">
        {MILESTONE_LEVELS.map((lvl) => {
          const ability = byLevel[lvl];
          const unlocked = characterLevel >= lvl;

          return (
            <div key={lvl} className={`pl-3 border-l ${unlocked ? "border-border" : "border-muted"}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-sm font-medium ${unlocked ? "" : "text-muted-foreground"}`}>
                  {ability?.name ?? `Level ${lvl} feature`}
                </span>
                {!unlocked && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Level {lvl}
                  </span>
                )}
              </div>
              {unlocked && ability && <FeatureDescription description={ability.description} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
