import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, characters, campaignCharacters, type NewCampaign, type Campaign } from "@/db/schema";

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
