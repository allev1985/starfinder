"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { modifier } from "@/lib/ability";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import {
  updateInitiativeMiscModAction,
  updateBaseAttackBonusAction,
  updateEacArmorBonusAction,
  updateEacMiscModAction,
  updateKacArmorBonusAction,
  updateKacMiscModAction,
} from "../actions";

type Props = {
  characterId: string;
  dexScore: number;
  initiativeMiscMod: number;
  baseAttackBonus: number;
  eacArmorBonus: number;
  eacMiscMod: number;
  kacArmorBonus: number;
  kacMiscMod: number;
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
  eacArmorBonus,
  eacMiscMod,
  kacArmorBonus,
  kacMiscMod,
  isOwner,
}: Props) {
  const [miscMod, setMiscMod] = useState(initiativeMiscMod);
  const [bab, setBab] = useState(baseAttackBonus);
  const [eacBonus, setEacBonus] = useState(eacArmorBonus);
  const [eacMisc, setEacMisc] = useState(eacMiscMod);
  const [kacBonus, setKacBonus] = useState(kacArmorBonus);
  const [kacMisc, setKacMisc] = useState(kacMiscMod);

  const scheduleMiscModSave = useDebouncedSave((value: number) =>
    updateInitiativeMiscModAction(characterId, value)
  );
  const scheduleBabSave = useDebouncedSave((value: number) =>
    updateBaseAttackBonusAction(characterId, value)
  );
  const scheduleEacBonusSave = useDebouncedSave((value: number) =>
    updateEacArmorBonusAction(characterId, value)
  );
  const scheduleEacMiscSave = useDebouncedSave((value: number) =>
    updateEacMiscModAction(characterId, value)
  );
  const scheduleKacBonusSave = useDebouncedSave((value: number) =>
    updateKacArmorBonusAction(characterId, value)
  );
  const scheduleKacMiscSave = useDebouncedSave((value: number) =>
    updateKacMiscModAction(characterId, value)
  );

  const dexMod = modifier(dexScore);
  const initiativeTotal = dexMod + miscMod;
  const eacTotal = 10 + eacBonus + dexMod + eacMisc;
  const kacTotal = 10 + kacBonus + dexMod + kacMisc;
  const kacVsCm = 8 + kacTotal;

  function parseInput(raw: string): number {
    return isNaN(parseInt(raw, 10)) ? 0 : parseInt(raw, 10);
  }

  function numericInput(
    value: number,
    onChange: (v: number) => void,
  ) {
    return isOwner ? (
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInput(e.target.value))}
        className="h-7 text-sm text-center"
      />
    ) : (
      <span className="text-sm text-center">{value}</span>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Combat Stats
      </h2>

      {/* Initiative + BAB */}
      <div className="mb-4 grid grid-cols-[12rem_5rem_5rem_5rem] items-center gap-x-3 gap-y-2">
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
            onChange={(e) => { const v = parseInput(e.target.value); setMiscMod(v); scheduleMiscModSave(v); }}
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
            onChange={(e) => { const v = parseInput(e.target.value); setBab(v); scheduleBabSave(v); }}
            className="h-7 text-sm text-center"
          />
        ) : (
          <span className="text-sm text-center">{formatModifier(bab)}</span>
        )}
      </div>

      {/* Armor Class */}
      <div className="grid grid-cols-[12rem_5rem_5rem_5rem_5rem] items-center gap-x-3 gap-y-2">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Total</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Armor Bonus</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">DEX Mod</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Misc</span>

        <span className="text-sm font-medium">EAC</span>
        <span className="text-sm text-center">{eacTotal}</span>
        {numericInput(eacBonus, (v) => { setEacBonus(v); scheduleEacBonusSave(v); })}
        <span className="text-sm text-muted-foreground text-center">{formatModifier(dexMod)}</span>
        {numericInput(eacMisc, (v) => { setEacMisc(v); scheduleEacMiscSave(v); })}

        <span className="text-sm font-medium">KAC</span>
        <span className="text-sm text-center">{kacTotal}</span>
        {numericInput(kacBonus, (v) => { setKacBonus(v); scheduleKacBonusSave(v); })}
        <span className="text-sm text-muted-foreground text-center">{formatModifier(dexMod)}</span>
        {numericInput(kacMisc, (v) => { setKacMisc(v); scheduleKacMiscSave(v); })}

        <span className="text-sm font-medium">KAC vs. CM</span>
        <span className="text-sm text-center">{kacVsCm}</span>
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
