import { modifier } from "@/lib/ability";

export type CombatStatsInput = {
  scores: {
    strScore: number;
    dexScore: number;
    conScore: number;
    wisScore: number;
  };
  mods: {
    initiativeMiscMod: number;
    baseAttackBonus: number;
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
  };
  equippedArmor: { eacBonus: number; kacBonus: number; maxDexBonus: number | null } | null;
  equippedShield: { eacBonus: number; kacBonus: number; maxDexBonus: number | null } | null;
  hasShieldProficiency: boolean;
};

export type CombatStatsResult = {
  effectiveDex: number;
  initiativeTotal: number;
  eacTotal: number;
  kacTotal: number;
  kacVsCm: number;
  meleeTotal: number;
  rangedTotal: number;
  thrownTotal: number;
  fortTotal: number;
  refTotal: number;
  willTotal: number;
};

export function calculateCombatStats(input: CombatStatsInput): CombatStatsResult {
  const { scores, mods, equippedArmor, equippedShield, hasShieldProficiency } = input;

  const strMod = modifier(scores.strScore);
  const dexMod = modifier(scores.dexScore);
  const conMod = modifier(scores.conScore);
  const wisMod = modifier(scores.wisScore);

  const eacArmorBonus = equippedArmor?.eacBonus ?? 0;
  const kacArmorBonus = equippedArmor?.kacBonus ?? 0;

  const armorMaxDex = equippedArmor?.maxDexBonus ?? null;
  const shieldMaxDex = equippedShield?.maxDexBonus ?? null;
  const effectiveMaxDex =
    armorMaxDex != null && shieldMaxDex != null
      ? Math.min(armorMaxDex, shieldMaxDex)
      : armorMaxDex ?? shieldMaxDex;
  const effectiveDex = effectiveMaxDex != null ? Math.min(dexMod, effectiveMaxDex) : dexMod;

  const shieldEacBonus = hasShieldProficiency ? (equippedShield?.eacBonus ?? 0) : 0;
  const shieldKacBonus = hasShieldProficiency ? (equippedShield?.kacBonus ?? 0) : 0;

  return {
    effectiveDex,
    initiativeTotal: dexMod + mods.initiativeMiscMod,
    eacTotal: 10 + eacArmorBonus + shieldEacBonus + effectiveDex + mods.eacMiscMod,
    kacTotal: 10 + kacArmorBonus + shieldKacBonus + effectiveDex + mods.kacMiscMod,
    kacVsCm: 8 + (10 + kacArmorBonus + shieldKacBonus + effectiveDex + mods.kacMiscMod),
    meleeTotal: mods.baseAttackBonus + strMod + mods.meleeAttackMiscMod,
    rangedTotal: mods.baseAttackBonus + dexMod + mods.rangedAttackMiscMod,
    thrownTotal: mods.baseAttackBonus + strMod + mods.thrownAttackMiscMod,
    fortTotal: mods.fortBaseSave + conMod + mods.fortMiscMod,
    refTotal: mods.refBaseSave + dexMod + mods.refMiscMod,
    willTotal: mods.willBaseSave + wisMod + mods.willMiscMod,
  };
}
