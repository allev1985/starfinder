import type { Character, CharacterCombatStats, Armor } from "@/db/schema";

export const characterFixture: Character = {
  id: "char-001",
  name: "Aria Voss",
  ownerId: "user-001",
  raceId: "race-001",
  classId: "class-001",
  themeId: "theme-001",
  chassisId: null,
  mechanicCharacterId: null,
  editionId: "edition-001",
  level: 5,
  strScore: 14,  // mod +2
  dexScore: 16,  // mod +3
  conScore: 12,  // mod +1
  intScore: 10,  // mod +0
  wisScore: 10,  // mod +0
  chaScore: 8,   // mod -1
  credits: 5000,
  xpEarned: 15000,
  languages: ["Common", "Vesk"],
  createdAt: new Date("2025-01-01T00:00:00Z"),
};

export const combatStatsFixture: CharacterCombatStats = {
  characterId: "char-001",
  initiativeMiscMod: 1,
  baseAttackBonus: 4,
  staminaPointsTotal: 35,
  staminaPointsCurrent: 35,
  hitPointsTotal: 20,
  hitPointsCurrent: 20,
  resolvePointsTotal: 5,
  resolvePointsCurrent: 5,
  eacMiscMod: 0,
  kacMiscMod: 0,
  fortBaseSave: 3,
  fortMiscMod: 0,
  refBaseSave: 4,
  refMiscMod: 0,
  willBaseSave: 2,
  willMiscMod: 0,
  meleeAttackMiscMod: 0,
  rangedAttackMiscMod: 0,
  thrownAttackMiscMod: 0,
};

export const armorFixture: Armor = {
  id: "armor-001",
  name: "Estex Suit II",
  type: "light",
  itemLevel: 3,
  price: 1250,
  eacBonus: 4,
  kacBonus: 5,
  maxDexBonus: 5,
  armorCheckPenalty: 0,
  speedAdjustment: 0,
  bulk: "L",
  upgradeSlots: 1,
  sourceBook: "crb",
  dr: null,
  resistances: null,
  editionId: "edition-001",
};

export const shieldFixture = {
  id: "equip-shield-001",
  name: "Riot Shield",
  eacBonus: 1,
  kacBonus: 2,
  maxDexBonus: null as number | null,
};
