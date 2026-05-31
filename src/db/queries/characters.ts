import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  characters,
  campaigns,
  campaignCharacters,
  races,
  classes,
  themes,
  characterRaceAttributeValues,
  characterCombatStats,
  type NewCharacter,
  type Character,
  type Campaign,
  type CharacterRaceAttributeValue,
  type CharacterCombatStats,
} from "@/db/schema";

export async function getCharactersByOwner(ownerId: string): Promise<Character[]> {
  return db.select().from(characters).where(eq(characters.ownerId, ownerId));
}

export async function getCharacterById(id: string): Promise<Character | null> {
  const [character] = await db.select().from(characters).where(eq(characters.id, id)).limit(1);
  return character ?? null;
}

export async function createCharacter(data: NewCharacter): Promise<Character> {
  const [character] = await db.insert(characters).values(data).returning();
  await db.insert(characterCombatStats).values({ characterId: character.id });
  return character;
}

export async function updateCharacter(
  id: string,
  data: { name: string; raceId?: string | null; classId?: string | null; themeId?: string | null }
): Promise<Character> {
  const [updated] = await db
    .update(characters)
    .set(data)
    .where(eq(characters.id, id))
    .returning();
  return updated;
}

export async function updateCharacterLevel(
  id: string,
  level: number
): Promise<Character> {
  const [updated] = await db
    .update(characters)
    .set({ level })
    .where(eq(characters.id, id))
    .returning();
  return updated;
}

export async function deleteCharacter(id: string): Promise<void> {
  await db.delete(campaignCharacters).where(eq(campaignCharacters.characterId, id));
  await db.delete(characters).where(eq(characters.id, id));
}

export type CharacterWithMeta = Character & {
  raceName: string | null;
  className: string | null;
  themeName: string | null;
  level: number;
};

export async function getCharacterWithCampaigns(
  characterId: string
): Promise<{ character: CharacterWithMeta | null; campaigns: Campaign[] }> {
  const [row] = await db
    .select({
      id: characters.id,
      name: characters.name,
      ownerId: characters.ownerId,
      raceId: characters.raceId,
      classId: characters.classId,
      themeId: characters.themeId,
      level: characters.level,
      strScore: characters.strScore,
      dexScore: characters.dexScore,
      conScore: characters.conScore,
      intScore: characters.intScore,
      wisScore: characters.wisScore,
      chaScore: characters.chaScore,
      createdAt: characters.createdAt,
      raceName: races.name,
      className: classes.name,
      themeName: themes.name,
    })
    .from(characters)
    .leftJoin(races, eq(characters.raceId, races.id))
    .leftJoin(classes, eq(characters.classId, classes.id))
    .leftJoin(themes, eq(characters.themeId, themes.id))
    .where(eq(characters.id, characterId));

  if (!row) return { character: null, campaigns: [] };

  const character: CharacterWithMeta = {
    id: row.id,
    name: row.name,
    ownerId: row.ownerId,
    raceId: row.raceId,
    classId: row.classId,
    themeId: row.themeId,
    level: row.level,
    strScore: row.strScore,
    dexScore: row.dexScore,
    conScore: row.conScore,
    intScore: row.intScore,
    wisScore: row.wisScore,
    chaScore: row.chaScore,
    createdAt: row.createdAt,
    raceName: row.raceName ?? null,
    className: row.className ?? null,
    themeName: row.themeName ?? null,
  };

  const joined = await db
    .select({ campaign: campaigns })
    .from(campaigns)
    .innerJoin(campaignCharacters, eq(campaignCharacters.campaignId, campaigns.id))
    .where(eq(campaignCharacters.characterId, characterId))
    .then((rows) => rows.map((r) => r.campaign));

  return { character, campaigns: joined };
}

export async function findCampaignByJoinCode(
  code: string
): Promise<Campaign | null> {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.joinCode, code));
  return campaign ?? null;
}

export async function isAlreadyInCampaign(
  campaignId: string,
  characterId: string
): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(campaignCharacters)
    .where(
      and(
        eq(campaignCharacters.campaignId, campaignId),
        eq(campaignCharacters.characterId, characterId)
      )
    )
    .limit(1);
  return !!existing;
}

export async function joinCampaign(
  campaignId: string,
  characterId: string
): Promise<void> {
  await db.insert(campaignCharacters).values({ campaignId, characterId });
}

export async function checkIsCharacterOwner(
  characterId: string,
  userId: string
): Promise<boolean> {
  const [row] = await db
    .select({ id: characters.id })
    .from(characters)
    .where(and(eq(characters.id, characterId), eq(characters.ownerId, userId)))
    .limit(1);
  return !!row;
}

export async function getCharacterCampaignIds(
  characterId: string
): Promise<string[]> {
  const rows = await db
    .select({ campaignId: campaignCharacters.campaignId })
    .from(campaignCharacters)
    .where(eq(campaignCharacters.characterId, characterId));
  return rows.map((r) => r.campaignId);
}

export async function getCharacterRaceAttributeValues(
  characterId: string
): Promise<CharacterRaceAttributeValue[]> {
  return db
    .select()
    .from(characterRaceAttributeValues)
    .where(eq(characterRaceAttributeValues.characterId, characterId));
}

export async function deleteCharacterRaceAttributeValues(characterId: string): Promise<void> {
  await db
    .delete(characterRaceAttributeValues)
    .where(eq(characterRaceAttributeValues.characterId, characterId));
}

export type AbilityScores = {
  strScore: number;
  dexScore: number;
  conScore: number;
  intScore: number;
  wisScore: number;
  chaScore: number;
};

export async function updateCharacterAbilityScores(
  id: string,
  scores: AbilityScores
): Promise<Character> {
  const [updated] = await db
    .update(characters)
    .set(scores)
    .where(eq(characters.id, id))
    .returning();
  return updated;
}

export async function getCharacterCombatStats(
  characterId: string
): Promise<CharacterCombatStats | null> {
  const [row] = await db
    .select()
    .from(characterCombatStats)
    .where(eq(characterCombatStats.characterId, characterId))
    .limit(1);
  return row ?? null;
}

export async function updateInitiativeMiscMod(
  characterId: string,
  value: number
): Promise<void> {
  await db
    .update(characterCombatStats)
    .set({ initiativeMiscMod: value })
    .where(eq(characterCombatStats.characterId, characterId));
}

export type HealthResolveValues = {
  staminaPointsTotal: number;
  staminaPointsCurrent: number;
  hitPointsTotal: number;
  hitPointsCurrent: number;
  resolvePointsTotal: number;
  resolvePointsCurrent: number;
};

export async function updateHealthResolve(
  characterId: string,
  values: HealthResolveValues
): Promise<void> {
  await db
    .update(characterCombatStats)
    .set(values)
    .where(eq(characterCombatStats.characterId, characterId));
}

export async function updateBaseAttackBonus(
  characterId: string,
  value: number
): Promise<void> {
  await db
    .update(characterCombatStats)
    .set({ baseAttackBonus: value })
    .where(eq(characterCombatStats.characterId, characterId));
}

export async function upsertCharacterRaceAttributeValue(
  characterId: string,
  attributeId: string,
  value: string
): Promise<void> {
  await db
    .insert(characterRaceAttributeValues)
    .values({ characterId, attributeId, value })
    .onConflictDoUpdate({
      target: [characterRaceAttributeValues.characterId, characterRaceAttributeValues.attributeId],
      set: { value },
    });
}
