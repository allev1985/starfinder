"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { modifier } from "@/lib/ability";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { updateInitiativeMiscModAction, updateBaseAttackBonusAction } from "../actions";

type Props = {
  characterId: string;
  dexScore: number;
  initiativeMiscMod: number;
  baseAttackBonus: number;
  isOwner: boolean;
};

function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

export default function CombatStatsSection({
  characterId,
  dexScore,
  initiativeMiscMod,
  baseAttackBonus,
  isOwner,
}: Props) {
  const [miscMod, setMiscMod] = useState(initiativeMiscMod);
  const [bab, setBab] = useState(baseAttackBonus);

  const scheduleMiscModSave = useDebouncedSave((value: number) =>
    updateInitiativeMiscModAction(characterId, value)
  );
  const scheduleBabSave = useDebouncedSave((value: number) =>
    updateBaseAttackBonusAction(characterId, value)
  );

  const dexMod = modifier(dexScore);
  const initiativeTotal = dexMod + miscMod;

  function handleMiscModChange(raw: string) {
    const value = isNaN(parseInt(raw, 10)) ? 0 : parseInt(raw, 10);
    setMiscMod(value);
    scheduleMiscModSave(value);
  }

  function handleBabChange(raw: string) {
    const value = isNaN(parseInt(raw, 10)) ? 0 : parseInt(raw, 10);
    setBab(value);
    scheduleBabSave(value);
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
        <span className="text-sm text-center">{formatModifier(initiativeTotal)}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(dexMod)}</span>
        {isOwner ? (
          <Input
            type="number"
            value={miscMod}
            onChange={(e) => handleMiscModChange(e.target.value)}
            className="h-7 text-sm text-center"
          />
        ) : (
          <span className="text-sm text-center">{formatModifier(miscMod)}</span>
        )}

        <span className="text-sm font-medium">Base Attack Bonus</span>
        <span className="text-sm text-center">{formatModifier(bab)}</span>
        <span />
        {isOwner ? (
          <Input
            type="number"
            value={bab}
            onChange={(e) => handleBabChange(e.target.value)}
            className="h-7 text-sm text-center"
          />
        ) : (
          <span className="text-sm text-center">{formatModifier(bab)}</span>
        )}
      </div>
    </section>
  );
}
