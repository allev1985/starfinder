import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, campaignCharacters, characters } from "@/db/schema";

export async function isCampaignParticipant(
  campaignId: string,
  userId: string
): Promise<boolean> {
  const [asDm] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.dmId, userId)))
    .limit(1);

  if (asDm) return true;

  const [asPlayer] = await db
    .select({ characterId: campaignCharacters.characterId })
    .from(campaignCharacters)
    .innerJoin(characters, eq(characters.id, campaignCharacters.characterId))
    .where(
      and(
        eq(campaignCharacters.campaignId, campaignId),
        eq(characters.ownerId, userId)
      )
    )
    .limit(1);

  return !!asPlayer;
}
