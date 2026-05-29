import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, characters, campaignCharacters, type NewCampaign, type Campaign, type Character } from "@/db/schema";

export async function createCampaign(data: NewCampaign): Promise<Campaign> {
  const [campaign] = await db.insert(campaigns).values(data).returning();
  return campaign;
}

export async function getCampaignsByDm(dmId: string): Promise<Campaign[]> {
  return db.select().from(campaigns).where(eq(campaigns.dmId, dmId));
}

export async function getCampaignsForUser(
  userId: string
): Promise<{ dmCampaigns: Campaign[]; playerCampaigns: Campaign[] }> {
  const dmCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.dmId, userId));

  const playerCampaigns = await db
    .selectDistinct({ campaign: campaigns })
    .from(campaigns)
    .innerJoin(campaignCharacters, eq(campaignCharacters.campaignId, campaigns.id))
    .innerJoin(characters, eq(characters.id, campaignCharacters.characterId))
    .where(eq(characters.ownerId, userId))
    .then((rows) => rows.map((r) => r.campaign));

  return { dmCampaigns, playerCampaigns };
}

export async function getCampaignWithCharacters(
  campaignId: string
): Promise<{ campaign: Campaign | null; characters: Character[] }> {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId));

  if (!campaign) return { campaign: null, characters: [] };

  const joined = await db
    .select({ character: characters })
    .from(characters)
    .innerJoin(campaignCharacters, eq(campaignCharacters.characterId, characters.id))
    .where(eq(campaignCharacters.campaignId, campaignId))
    .then((rows) => rows.map((r) => r.character));

  return { campaign, characters: joined };
}

export async function getCharacterById(characterId: string): Promise<Character | null> {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId));
  return character ?? null;
}
