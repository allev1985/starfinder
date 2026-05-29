import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, type NewCampaign, type Campaign } from "@/db/schema";

export async function createCampaign(data: NewCampaign): Promise<Campaign> {
  const [campaign] = await db.insert(campaigns).values(data).returning();
  return campaign;
}

export async function getCampaignsByDm(dmId: string): Promise<Campaign[]> {
  return db.select().from(campaigns).where(eq(campaigns.dmId, dmId));
}
