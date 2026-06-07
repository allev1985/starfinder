import "server-only";
import { and, eq, asc } from "drizzle-orm";
import { db } from "@/db";
import {
  battles,
  battleCombatants,
  campaignCharacters,
  characters,
  characterCombatStats,
  characterArmor,
  armor,
  type Battle,
  type BattleCombatant,
  type NewBattleCombatant,
} from "@/db/schema";

export async function getActiveBattleForCampaign(campaignId: string): Promise<Battle | null> {
  const [row] = await db.select().from(battles).where(eq(battles.campaignId, campaignId)).limit(1);
  return row ?? null;
}

export async function getBattleCombatants(battleId: string): Promise<BattleCombatant[]> {
  return db
    .select()
    .from(battleCombatants)
    .where(eq(battleCombatants.battleId, battleId))
    .orderBy(asc(battleCombatants.sortOrder));
}

export async function createBattle(campaignId: string): Promise<Battle> {
  const [battle] = await db.insert(battles).values({ campaignId }).returning();
  return battle;
}

export async function deleteBattle(battleId: string): Promise<void> {
  await db.delete(battles).where(eq(battles.id, battleId));
}

export async function updateBattleTurn(
  battleId: string,
  data: { currentTurnIndex: number; currentRound: number }
): Promise<void> {
  await db.update(battles).set(data).where(eq(battles.id, battleId));
}

export async function updateBattleStatus(battleId: string, status: "active"): Promise<void> {
  await db.update(battles).set({ status }).where(eq(battles.id, battleId));
}

export async function insertPcCombatants(battleId: string, campaignId: string): Promise<void> {
  const campaignChars = await db
    .select({ id: characters.id, name: characters.name })
    .from(characters)
    .innerJoin(campaignCharacters, eq(campaignCharacters.characterId, characters.id))
    .where(eq(campaignCharacters.campaignId, campaignId));

  if (campaignChars.length === 0) return;

  await db.insert(battleCombatants).values(
    campaignChars.map((c) => ({
      battleId,
      type: "pc" as const,
      characterId: c.id,
      displayName: c.name,
    }))
  );
}

export async function insertEnemyCombatant(
  data: Pick<NewBattleCombatant, "battleId" | "displayName" | "initiativeTotal" | "hidden" | "hpTotal" | "hpCurrent" | "eac" | "kac">
): Promise<BattleCombatant> {
  const [row] = await db
    .insert(battleCombatants)
    .values({ ...data, type: "enemy" })
    .returning();
  return row;
}

export async function updateCombatantInitiative(combatantId: string, initiativeTotal: number): Promise<boolean> {
  const rows = await db
    .update(battleCombatants)
    .set({ initiativeTotal })
    .where(eq(battleCombatants.id, combatantId))
    .returning({ id: battleCombatants.id });
  return rows.length > 0;
}

export async function updateCombatantDefeated(combatantId: string, defeated: boolean): Promise<void> {
  await db.update(battleCombatants).set({ defeated }).where(eq(battleCombatants.id, combatantId));
}

export async function updateCombatantHidden(combatantId: string, hidden: boolean): Promise<void> {
  await db.update(battleCombatants).set({ hidden }).where(eq(battleCombatants.id, combatantId));
}

export async function updateCombatantSortOrders(
  updates: { id: string; sortOrder: number }[]
): Promise<void> {
  await db.transaction(async (tx) => {
    for (const { id, sortOrder } of updates) {
      await tx.update(battleCombatants).set({ sortOrder }).where(eq(battleCombatants.id, id));
    }
  });
}

export async function updateEnemyStats(
  combatantId: string,
  data: { hpTotal?: number; hpCurrent?: number; eac?: number; kac?: number }
): Promise<void> {
  await db.update(battleCombatants).set(data).where(and(eq(battleCombatants.id, combatantId), eq(battleCombatants.type, "enemy")));
}

export async function getCombatantByCharacter(
  battleId: string,
  characterId: string
): Promise<BattleCombatant | null> {
  const [row] = await db
    .select()
    .from(battleCombatants)
    .where(and(eq(battleCombatants.battleId, battleId), eq(battleCombatants.characterId, characterId)))
    .limit(1);
  return row ?? null;
}

export type BattlePartyMember = {
  characterId: string;
  name: string;
  ownerId: string;
  strScore: number;
  dexScore: number;
  initiativeMiscMod: number;
  baseAttackBonus: number;
  eacMiscMod: number;
  kacMiscMod: number;
  meleeAttackMiscMod: number;
  rangedAttackMiscMod: number;
  staminaPointsTotal: number;
  staminaPointsCurrent: number;
  hitPointsTotal: number;
  hitPointsCurrent: number;
  resolvePointsTotal: number;
  resolvePointsCurrent: number;
  armorEacBonus: number;
  armorKacBonus: number;
};

export async function getBattlePartyMembers(campaignId: string): Promise<BattlePartyMember[]> {
  const wornArmor = db.select().from(characterArmor).as("worn_armor");

  const rows = await db
    .select({
      characterId: characters.id,
      name: characters.name,
      ownerId: characters.ownerId,
      strScore: characters.strScore,
      dexScore: characters.dexScore,
      initiativeMiscMod: characterCombatStats.initiativeMiscMod,
      baseAttackBonus: characterCombatStats.baseAttackBonus,
      eacMiscMod: characterCombatStats.eacMiscMod,
      kacMiscMod: characterCombatStats.kacMiscMod,
      meleeAttackMiscMod: characterCombatStats.meleeAttackMiscMod,
      rangedAttackMiscMod: characterCombatStats.rangedAttackMiscMod,
      staminaPointsTotal: characterCombatStats.staminaPointsTotal,
      staminaPointsCurrent: characterCombatStats.staminaPointsCurrent,
      hitPointsTotal: characterCombatStats.hitPointsTotal,
      hitPointsCurrent: characterCombatStats.hitPointsCurrent,
      resolvePointsTotal: characterCombatStats.resolvePointsTotal,
      resolvePointsCurrent: characterCombatStats.resolvePointsCurrent,
      armorEacBonus: armor.eacBonus,
      armorKacBonus: armor.kacBonus,
    })
    .from(characters)
    .innerJoin(campaignCharacters, eq(campaignCharacters.characterId, characters.id))
    .leftJoin(characterCombatStats, eq(characterCombatStats.characterId, characters.id))
    .leftJoin(wornArmor, and(eq(wornArmor.characterId, characters.id), eq(wornArmor.worn, true)))
    .leftJoin(armor, eq(armor.id, wornArmor.armorId))
    .where(eq(campaignCharacters.campaignId, campaignId));

  return rows.map((r) => ({
    characterId: r.characterId,
    name: r.name,
    ownerId: r.ownerId,
    strScore: r.strScore,
    dexScore: r.dexScore,
    initiativeMiscMod: r.initiativeMiscMod ?? 0,
    baseAttackBonus: r.baseAttackBonus ?? 0,
    eacMiscMod: r.eacMiscMod ?? 0,
    kacMiscMod: r.kacMiscMod ?? 0,
    meleeAttackMiscMod: r.meleeAttackMiscMod ?? 0,
    rangedAttackMiscMod: r.rangedAttackMiscMod ?? 0,
    staminaPointsTotal: r.staminaPointsTotal ?? 0,
    staminaPointsCurrent: r.staminaPointsCurrent ?? 0,
    hitPointsTotal: r.hitPointsTotal ?? 0,
    hitPointsCurrent: r.hitPointsCurrent ?? 0,
    resolvePointsTotal: r.resolvePointsTotal ?? 0,
    resolvePointsCurrent: r.resolvePointsCurrent ?? 0,
    armorEacBonus: r.armorEacBonus ?? 0,
    armorKacBonus: r.armorKacBonus ?? 0,
  }));
}
