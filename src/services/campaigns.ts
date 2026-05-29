import "server-only";
import { createCampaign } from "@/db/queries/campaigns";
import type { Campaign } from "@/db/schema";

function generateJoinCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function createCampaignForUser({
  name,
  dmId,
}: {
  name: string;
  dmId: string;
}): Promise<Campaign> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await createCampaign({
        name,
        dmId,
        joinCode: generateJoinCode(),
      });
    } catch (err) {
      const isUniqueViolation =
        err instanceof Error && err.message.includes("campaigns_join_code_unique");
      if (!isUniqueViolation || attempt === 1) throw err;
    }
  }
  throw new Error("Failed to generate unique join code");
}
