"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { modifier } from "@/lib/ability";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import ArmorPicker from "./armor-picker";
import {
  updateInitiativeMiscModAction,
  updateBaseAttackBonusAction,
  updateEacMiscModAction,
  updateKacMiscModAction,
  updateFortBaseSaveAction,
  updateFortMiscModAction,
  updateRefBaseSaveAction,
  updateRefMiscModAction,
  updateWillBaseSaveAction,
  updateWillMiscModAction,
  updateMeleeAttackMiscModAction,
  updateRangedAttackMiscModAction,
  updateThrownAttackMiscModAction,
} from "../actions";
import type { Armor } from "@/db/schema";

type Props = {
  characterId: string;
  strScore: number;
  dexScore: number;
  conScore: number;
  wisScore: number;
  initiativeMiscMod: number;
  baseAttackBonus: number;
  equippedArmor: Armor | null;
  availableArmor: Armor[];
  onArmorChange: (armor: Armor | null) => void;
  eacMiscMod: number;
  kacMiscMod: number;
  fortBaseSave: number;
  fortMiscMod: number;
  refBaseSave: number;
  refMiscMod: number;
  willBaseSave: number;
  willMiscMod: number;
  meleeAttackMiscMod: number;
  rangedAttackMiscMod: number;
  thrownAttackMiscMod: number;
  isOwner: boolean;
};

function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

export default function CombatStatsSection({
  characterId,
  strScore,
  dexScore,
  conScore,
  wisScore,
  initiativeMiscMod,
  baseAttackBonus,
  equippedArmor,
  availableArmor,
  onArmorChange,
  eacMiscMod,
  kacMiscMod,
  fortBaseSave,
  fortMiscMod,
  refBaseSave,
  refMiscMod,
  willBaseSave,
  willMiscMod,
  meleeAttackMiscMod,
  rangedAttackMiscMod,
  thrownAttackMiscMod,
  isOwner,
}: Props) {
  const [miscMod, setMiscMod] = useState(initiativeMiscMod);
  const [bab, setBab] = useState(baseAttackBonus);
  const [eacMisc, setEacMisc] = useState(eacMiscMod);
  const [kacMisc, setKacMisc] = useState(kacMiscMod);
  const [fortBase, setFortBase] = useState(fortBaseSave);
  const [fortMisc, setFortMisc] = useState(fortMiscMod);
  const [refBase, setRefBase] = useState(refBaseSave);
  const [refMisc, setRefMisc] = useState(refMiscMod);
  const [willBase, setWillBase] = useState(willBaseSave);
  const [willMisc, setWillMisc] = useState(willMiscMod);
  const [meleeMisc, setMeleeMisc] = useState(meleeAttackMiscMod);
  const [rangedMisc, setRangedMisc] = useState(rangedAttackMiscMod);
  const [thrownMisc, setThrownMisc] = useState(thrownAttackMiscMod);

  const scheduleMiscModSave = useDebouncedSave((value: number) =>
    updateInitiativeMiscModAction(characterId, value)
  );
  const scheduleBabSave = useDebouncedSave((value: number) =>
    updateBaseAttackBonusAction(characterId, value)
  );
  const scheduleEacMiscSave = useDebouncedSave((value: number) =>
    updateEacMiscModAction(characterId, value)
  );
  const scheduleKacMiscSave = useDebouncedSave((value: number) =>
    updateKacMiscModAction(characterId, value)
  );
  const scheduleFortBaseSave = useDebouncedSave((value: number) =>
    updateFortBaseSaveAction(characterId, value)
  );
  const scheduleFortMiscSave = useDebouncedSave((value: number) =>
    updateFortMiscModAction(characterId, value)
  );
  const scheduleRefBaseSave = useDebouncedSave((value: number) =>
    updateRefBaseSaveAction(characterId, value)
  );
  const scheduleRefMiscSave = useDebouncedSave((value: number) =>
    updateRefMiscModAction(characterId, value)
  );
  const scheduleWillBaseSave = useDebouncedSave((value: number) =>
    updateWillBaseSaveAction(characterId, value)
  );
  const scheduleWillMiscSave = useDebouncedSave((value: number) =>
    updateWillMiscModAction(characterId, value)
  );
  const scheduleMeleeMiscSave = useDebouncedSave((value: number) =>
    updateMeleeAttackMiscModAction(characterId, value)
  );
  const scheduleRangedMiscSave = useDebouncedSave((value: number) =>
    updateRangedAttackMiscModAction(characterId, value)
  );
  const scheduleThrownMiscSave = useDebouncedSave((value: number) =>
    updateThrownAttackMiscModAction(characterId, value)
  );

  const strMod = modifier(strScore);
  const dexMod = modifier(dexScore);
  const conMod = modifier(conScore);
  const wisMod = modifier(wisScore);

  const eacArmorBonus = equippedArmor?.eacBonus ?? 0;
  const kacArmorBonus = equippedArmor?.kacBonus ?? 0;
  const effectiveDex = equippedArmor?.maxDexBonus != null
    ? Math.min(dexMod, equippedArmor.maxDexBonus)
    : dexMod;

  const initiativeTotal = dexMod + miscMod;
  const eacTotal = 10 + eacArmorBonus + effectiveDex + eacMisc;
  const kacTotal = 10 + kacArmorBonus + effectiveDex + kacMisc;
  const kacVsCm = 8 + kacTotal;
  const meleeTotal = bab + strMod + meleeMisc;
  const rangedTotal = bab + dexMod + rangedMisc;
  const thrownTotal = bab + strMod + thrownMisc;
  const fortTotal = fortBase + conMod + fortMisc;
  const refTotal = refBase + dexMod + refMisc;
  const willTotal = willBase + wisMod + willMisc;

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

      {/* Attack Bonuses */}
      <div className="mb-4 grid grid-cols-[12rem_5rem_5rem_5rem_5rem] items-center gap-x-3 gap-y-2">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Total</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">BAB</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Ability Mod</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Misc</span>

        <span className="text-sm font-medium">Melee Attack</span>
        <span className="text-sm text-center">{formatModifier(meleeTotal)}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(bab)}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(strMod)} STR</span>
        {numericInput(meleeMisc, (v) => { setMeleeMisc(v); scheduleMeleeMiscSave(v); })}

        <span className="text-sm font-medium">Ranged Attack</span>
        <span className="text-sm text-center">{formatModifier(rangedTotal)}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(bab)}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(dexMod)} DEX</span>
        {numericInput(rangedMisc, (v) => { setRangedMisc(v); scheduleRangedMiscSave(v); })}

        <span className="text-sm font-medium">Thrown Attack</span>
        <span className="text-sm text-center">{formatModifier(thrownTotal)}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(bab)}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(strMod)} STR</span>
        {numericInput(thrownMisc, (v) => { setThrownMisc(v); scheduleThrownMiscSave(v); })}
      </div>

      {/* Armor Class */}
      <ArmorPicker
        availableArmor={availableArmor}
        equippedArmor={equippedArmor}
        characterId={characterId}
        isOwner={isOwner}
        onArmorChange={onArmorChange}
      />

      <div className="mb-2 grid grid-cols-[12rem_5rem_5rem_5rem_5rem] items-center gap-x-3 gap-y-2">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Total</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Armor Bonus</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">DEX Mod</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Misc</span>

        <span className="text-sm font-medium">EAC</span>
        <span className="text-sm text-center">{eacTotal}</span>
        <span className="text-sm text-muted-foreground text-center">{eacArmorBonus}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(effectiveDex)}</span>
        {numericInput(eacMisc, (v) => { setEacMisc(v); scheduleEacMiscSave(v); })}

        <span className="text-sm font-medium">KAC</span>
        <span className="text-sm text-center">{kacTotal}</span>
        <span className="text-sm text-muted-foreground text-center">{kacArmorBonus}</span>
        <span className="text-sm text-muted-foreground text-center">{formatModifier(effectiveDex)}</span>
        {numericInput(kacMisc, (v) => { setKacMisc(v); scheduleKacMiscSave(v); })}

        <span className="text-sm font-medium">KAC vs. CM</span>
        <span className="text-sm text-center">{kacVsCm}</span>
        <span />
        <span />
        <span />
      </div>

      {/* Saving Throws */}
      <div className="grid grid-cols-[12rem_5rem_5rem_5rem_5rem] items-center gap-x-3 gap-y-2">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Total</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Base Save</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Ability Mod</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Misc</span>

        <span className="text-sm font-medium">Fortitude</span>
        <span className="text-sm text-center">{formatModifier(fortTotal)}</span>
        {numericInput(fortBase, (v) => { setFortBase(v); scheduleFortBaseSave(v); })}
        <span className="text-sm text-muted-foreground text-center">{formatModifier(conMod)} CON</span>
        {numericInput(fortMisc, (v) => { setFortMisc(v); scheduleFortMiscSave(v); })}

        <span className="text-sm font-medium">Reflex</span>
        <span className="text-sm text-center">{formatModifier(refTotal)}</span>
        {numericInput(refBase, (v) => { setRefBase(v); scheduleRefBaseSave(v); })}
        <span className="text-sm text-muted-foreground text-center">{formatModifier(dexMod)} DEX</span>
        {numericInput(refMisc, (v) => { setRefMisc(v); scheduleRefMiscSave(v); })}

        <span className="text-sm font-medium">Will</span>
        <span className="text-sm text-center">{formatModifier(willTotal)}</span>
        {numericInput(willBase, (v) => { setWillBase(v); scheduleWillBaseSave(v); })}
        <span className="text-sm text-muted-foreground text-center">{formatModifier(wisMod)} WIS</span>
        {numericInput(willMisc, (v) => { setWillMisc(v); scheduleWillMiscSave(v); })}
      </div>
    </section>
  );
}
