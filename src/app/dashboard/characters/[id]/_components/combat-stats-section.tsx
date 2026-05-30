"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { modifier } from "@/lib/ability";
import { updateInitiativeMiscModAction } from "../actions";

type Props = {
  characterId: string;
  dexScore: number;
  initiativeMiscMod: number;
  isOwner: boolean;
};

function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

export default function CombatStatsSection({
  characterId,
  dexScore,
  initiativeMiscMod,
  isOwner,
}: Props) {
  const [miscMod, setMiscMod] = useState(initiativeMiscMod);

  const dexMod = modifier(dexScore);
  const total = dexMod + miscMod;

  async function handleBlur(raw: string) {
    const parsed = parseInt(raw, 10);
    const value = isNaN(parsed) ? 0 : parsed;
    setMiscMod(value);
    await updateInitiativeMiscModAction(characterId, value);
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Combat Stats
      </h2>
      <div className="grid grid-cols-[12rem_5rem_5rem_5rem] items-center gap-x-3 gap-y-2">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Total</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">DEX Mod</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Misc</span>

        <span className="text-sm font-medium">Initiative</span>
        <span className="text-sm text-center">{formatModifier(total)}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(dexMod)}</span>
        {isOwner ? (
          <Input
            type="number"
            value={miscMod}
            onChange={(e) => setMiscMod(isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10))}
            onBlur={(e) => handleBlur(e.target.value)}
            className="h-7 text-sm text-center"
          />
        ) : (
          <span className="text-sm text-center">{formatModifier(miscMod)}</span>
        )}
      </div>
    </section>
  );
}
