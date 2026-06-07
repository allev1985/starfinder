"use client";

import StatTile from "@/components/stat-tile";
import { modifier } from "@/lib/ability";
import { useCharacter } from "./character-context";

export default function VitalsStrip() {
  const { scores, equippedArmor, equippedShield, hasShieldProficiency, combatMods: mods } = useCharacter();
  const { dexScore } = scores;
  const dexMod = modifier(dexScore);

  const armorMaxDex = equippedArmor?.maxDexBonus ?? null;
  const shieldMaxDex = equippedShield?.maxDexBonus ?? null;
  const effectiveMaxDex =
    armorMaxDex != null && shieldMaxDex != null ? Math.min(armorMaxDex, shieldMaxDex)
    : armorMaxDex ?? shieldMaxDex;
  const effectiveDex = effectiveMaxDex != null ? Math.min(dexMod, effectiveMaxDex) : dexMod;

  const shieldEacBonus = hasShieldProficiency ? (equippedShield?.eacBonus ?? 0) : 0;
  const shieldKacBonus = hasShieldProficiency ? (equippedShield?.kacBonus ?? 0) : 0;

  const eacTotal = 10 + (equippedArmor?.eacBonus ?? 0) + shieldEacBonus + effectiveDex + mods.eacMiscMod;
  const kacTotal = 10 + (equippedArmor?.kacBonus ?? 0) + shieldKacBonus + effectiveDex + mods.kacMiscMod;
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
