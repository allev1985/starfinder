"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { modifier } from "@/lib/ability";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
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

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="whitespace-nowrap text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex h-9 min-w-[2.75rem] items-center justify-center border border-border px-1 text-sm font-medium">
        {children}
      </div>
    </div>
  );
}

function Op({ children }: { children: string }) {
  return (
    <span className="self-end pb-2 text-sm text-muted-foreground">{children}</span>
  );
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

  const scheduleMiscModSave = useDebouncedSave((v: number) => updateInitiativeMiscModAction(characterId, v));
  const scheduleBabSave = useDebouncedSave((v: number) => updateBaseAttackBonusAction(characterId, v));
  const scheduleEacMiscSave = useDebouncedSave((v: number) => updateEacMiscModAction(characterId, v));
  const scheduleKacMiscSave = useDebouncedSave((v: number) => updateKacMiscModAction(characterId, v));
  const scheduleFortBaseSave = useDebouncedSave((v: number) => updateFortBaseSaveAction(characterId, v));
  const scheduleFortMiscSave = useDebouncedSave((v: number) => updateFortMiscModAction(characterId, v));
  const scheduleRefBaseSave = useDebouncedSave((v: number) => updateRefBaseSaveAction(characterId, v));
  const scheduleRefMiscSave = useDebouncedSave((v: number) => updateRefMiscModAction(characterId, v));
  const scheduleWillBaseSave = useDebouncedSave((v: number) => updateWillBaseSaveAction(characterId, v));
  const scheduleWillMiscSave = useDebouncedSave((v: number) => updateWillMiscModAction(characterId, v));
  const scheduleMeleeMiscSave = useDebouncedSave((v: number) => updateMeleeAttackMiscModAction(characterId, v));
  const scheduleRangedMiscSave = useDebouncedSave((v: number) => updateRangedAttackMiscModAction(characterId, v));
  const scheduleThrownMiscSave = useDebouncedSave((v: number) => updateThrownAttackMiscModAction(characterId, v));

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

  function editableCell(
    label: string,
    value: number,
    onChange: (v: number) => void,
  ) {
    return isOwner ? (
      <div className="flex flex-col items-center gap-0.5">
        <span className="whitespace-nowrap text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInput(e.target.value))}
          className="h-9 w-16 text-center text-sm"
        />
      </div>
    ) : (
      <Cell label={label}>{formatModifier(value)}</Cell>
    );
  }

  return (
    <>
      {/* Initiative */}
      <section className="mb-6">
        <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
          Initiative
        </h2>
        <div className="flex flex-wrap items-end gap-2">
          <Cell label="Total">{formatModifier(initiativeTotal)}</Cell>
          <Op>=</Op>
          <Cell label="DEX Mod">{formatModifier(dexMod)}</Cell>
          <Op>+</Op>
          {editableCell("Misc Mod", miscMod, (v) => { setMiscMod(v); scheduleMiscModSave(v); })}
        </div>
      </section>

      {/* Armor Class */}
      <section className="mb-6">
        <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
          Armor Class
        </h2>
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide">EAC — Energy Armor Class</p>
          <div className="flex flex-wrap items-end gap-2">
            <Cell label="Total">{eacTotal}</Cell>
            <Op>=</Op>
            <Cell label="10">10</Cell>
            <Op>+</Op>
            <Cell label="Armor Bonus">{eacArmorBonus}</Cell>
            <Op>+</Op>
            <Cell label="DEX Mod">{formatModifier(effectiveDex)}</Cell>
            <Op>+</Op>
            {editableCell("Misc Mod", eacMisc, (v) => { setEacMisc(v); scheduleEacMiscSave(v); })}
          </div>
        </div>
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide">KAC — Kinetic Armor Class</p>
          <div className="flex flex-wrap items-end gap-2">
            <Cell label="Total">{kacTotal}</Cell>
            <Op>=</Op>
            <Cell label="10">10</Cell>
            <Op>+</Op>
            <Cell label="Armor Bonus">{kacArmorBonus}</Cell>
            <Op>+</Op>
            <Cell label="DEX Mod">{formatModifier(effectiveDex)}</Cell>
            <Op>+</Op>
            {editableCell("Misc Mod", kacMisc, (v) => { setKacMisc(v); scheduleKacMiscSave(v); })}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <Cell label="AC vs. CM">{kacVsCm}</Cell>
          <Op>=</Op>
          <Cell label="8">8</Cell>
          <Op>+</Op>
          <Cell label="KAC">{kacTotal}</Cell>
        </div>
      </section>

      {/* Saving Throws */}
      <section className="mb-6">
        <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
          Saving Throws
        </h2>
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide">Fortitude (CON)</p>
          <div className="flex flex-wrap items-end gap-2">
            <Cell label="Total">{formatModifier(fortTotal)}</Cell>
            <Op>=</Op>
            {editableCell("Base Save", fortBase, (v) => { setFortBase(v); scheduleFortBaseSave(v); })}
            <Op>+</Op>
            <Cell label="CON Mod">{formatModifier(conMod)}</Cell>
            <Op>+</Op>
            {editableCell("Misc Mod", fortMisc, (v) => { setFortMisc(v); scheduleFortMiscSave(v); })}
          </div>
        </div>
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide">Reflex (DEX)</p>
          <div className="flex flex-wrap items-end gap-2">
            <Cell label="Total">{formatModifier(refTotal)}</Cell>
            <Op>=</Op>
            {editableCell("Base Save", refBase, (v) => { setRefBase(v); scheduleRefBaseSave(v); })}
            <Op>+</Op>
            <Cell label="DEX Mod">{formatModifier(dexMod)}</Cell>
            <Op>+</Op>
            {editableCell("Misc Mod", refMisc, (v) => { setRefMisc(v); scheduleRefMiscSave(v); })}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide">Will (WIS)</p>
          <div className="flex flex-wrap items-end gap-2">
            <Cell label="Total">{formatModifier(willTotal)}</Cell>
            <Op>=</Op>
            {editableCell("Base Save", willBase, (v) => { setWillBase(v); scheduleWillBaseSave(v); })}
            <Op>+</Op>
            <Cell label="WIS Mod">{formatModifier(wisMod)}</Cell>
            <Op>+</Op>
            {editableCell("Misc Mod", willMisc, (v) => { setWillMisc(v); scheduleWillMiscSave(v); })}
          </div>
        </div>
      </section>

      {/* Attack Bonuses */}
      <section className="mb-8">
        <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
          Attack Bonuses
        </h2>
        <div className="mb-3 flex flex-wrap items-end gap-2">
          <Cell label="Base Attack Bonus">{formatModifier(bab)}</Cell>
          {isOwner && (
            <>
              <Op>=</Op>
              <div className="flex flex-col items-center gap-0.5">
                <span className="whitespace-nowrap text-[10px] uppercase tracking-wide text-muted-foreground">
                  Edit BAB
                </span>
                <Input
                  type="number"
                  value={bab}
                  onChange={(e) => { const v = parseInput(e.target.value); setBab(v); scheduleBabSave(v); }}
                  className="h-9 w-16 text-center text-sm"
                />
              </div>
            </>
          )}
        </div>
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide">Melee Attack</p>
          <div className="flex flex-wrap items-end gap-2">
            <Cell label="Total">{formatModifier(meleeTotal)}</Cell>
            <Op>=</Op>
            <Cell label="BAB">{formatModifier(bab)}</Cell>
            <Op>+</Op>
            <Cell label="STR Mod">{formatModifier(strMod)}</Cell>
            <Op>+</Op>
            {editableCell("Misc Mod", meleeMisc, (v) => { setMeleeMisc(v); scheduleMeleeMiscSave(v); })}
          </div>
        </div>
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide">Ranged Attack</p>
          <div className="flex flex-wrap items-end gap-2">
            <Cell label="Total">{formatModifier(rangedTotal)}</Cell>
            <Op>=</Op>
            <Cell label="BAB">{formatModifier(bab)}</Cell>
            <Op>+</Op>
            <Cell label="DEX Mod">{formatModifier(dexMod)}</Cell>
            <Op>+</Op>
            {editableCell("Misc Mod", rangedMisc, (v) => { setRangedMisc(v); scheduleRangedMiscSave(v); })}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide">Thrown Attack</p>
          <div className="flex flex-wrap items-end gap-2">
            <Cell label="Total">{formatModifier(thrownTotal)}</Cell>
            <Op>=</Op>
            <Cell label="BAB">{formatModifier(bab)}</Cell>
            <Op>+</Op>
            <Cell label="STR Mod">{formatModifier(strMod)}</Cell>
            <Op>+</Op>
            {editableCell("Misc Mod", thrownMisc, (v) => { setThrownMisc(v); scheduleThrownMiscSave(v); })}
          </div>
        </div>
      </section>
    </>
  );
}
