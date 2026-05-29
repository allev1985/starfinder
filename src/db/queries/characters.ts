import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  characters,
  campaigns,
  campaignCharacters,
  type NewCharacter,
  type Character,
  type Campaign,
} from "@/db/schema";

export async function getCharactersByOwner(ownerId: string): Promise<Character[]> {
  return db.select().from(characters).where(eq(characters.ownerId, ownerId));
}

export async function createCharacter(data: NewCharacter): Promise<Character> {
  const [character] = await db.insert(characters).values(data).returning();
  return character;
}

export async function updateCharacter(
  id: string,
  data: { name: string }
): Promise<Character> {
  const [updated] = await db
    .update(characters)
    .set({ name: data.name })
    .where(eq(characters.id, id))
    .returning();
  return updated;
}

export async function deleteCharacter(id: string): Promise<void> {
  await db.delete(campaignCharacters).where(eq(campaignCharacters.characterId, id));
  await db.delete(characters).where(eq(characters.id, id));
}

export async function getCharacterWithCampaigns(
  characterId: string
): Promise<{ character: Character | null; campaigns: Campaign[] }> {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId));

  if (!character) return { character: null, campaigns: [] };

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
