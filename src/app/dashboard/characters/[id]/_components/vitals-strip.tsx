"use client";

import StatTile from "@/components/stat-tile";
import { modifier } from "@/lib/ability";
import { useCharacter } from "./character-context";

export default function VitalsStrip() {
  const { scores, equippedArmor, combatMods: mods } = useCharacter();
  const { dexScore } = scores;
  const dexMod = modifier(dexScore);
  const effectiveDex = equippedArmor?.maxDexBonus != null
    ? Math.min(dexMod, equippedArmor.maxDexBonus)
    : dexMod;

  const eacTotal = 10 + (equippedArmor?.eacBonus ?? 0) + effectiveDex + mods.eacMiscMod;
  const kacTotal = 10 + (equippedArmor?.kacBonus ?? 0) + effectiveDex + mods.kacMiscMod;
  const initiativeTotal = dexMod + mods.initiativeMiscMod;
  const initiativeMod = initiativeTotal >= 0 ? `+${initiativeTotal}` : `${initiativeTotal}`;

  return (
    <div
      className="grid grid-cols-3 gap-2 px-3 py-3"
      style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
    >
      <StatTile label="EAC" value={eacTotal} dark />
      <StatTile label="KAC" value={kacTotal} dark />
      <StatTile label="INITIATIVE" value={initiativeMod} mod="DEX" dark />
    </div>
  );
}
