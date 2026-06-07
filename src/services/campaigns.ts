import "server-only";
import {
  createCampaign,
  getCampaignsForUser,
  updateCampaign,
  updateCampaignJoinCode,
  deleteCampaign,
} from "@/db/queries/campaigns";
import { isCampaignGm } from "@/lib/authorization";
import { getEditionBySlug } from "@/db/queries/reference";
import type { Campaign } from "@/db/schema";

export type CampaignWithRole = Campaign & { role: "gm" | "player" };

export function generateJoinCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function createCampaignForUser({
  name,
  gmId,
}: {
  name: string;
  gmId: string;
}): Promise<Campaign> {
  const edition = await getEditionBySlug("1e");
  if (!edition) throw new Error("Edition '1e' not found.");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await createCampaign({
        name,
        gmId,
        joinCode: generateJoinCode(),
        editionId: edition.id,
      });
    } catch (err) {
      const isUniqueViolation =
        err instanceof Error && err.message.includes("campaigns_join_code_unique");
      if (!isUniqueViolation || attempt === 1) throw err;
    }
  }
  throw new Error("Failed to generate unique join code");
}

export async function listCampaignsForUser(userId: string): Promise<CampaignWithRole[]> {
  const { gmCampaigns, playerCampaigns } = await getCampaignsForUser(userId);

  const map = new Map<string, CampaignWithRole>();

  for (const c of playerCampaigns) {
    map.set(c.id, { ...c, role: "player" });
  }
  for (const c of gmCampaigns) {
    map.set(c.id, { ...c, role: "gm" });
  }

  return Array.from(map.values());
}

export async function updateCampaignForGm(
  campaignId: string,
  userId: string,
  data: { name: string }
): Promise<Campaign> {
  const isGm = await isCampaignGm(campaignId, userId);
  if (!isGm) throw new Error("Not authorised");
  return updateCampaign(campaignId, data);
}

export async function regenerateJoinCodeForGm(
  campaignId: string,
  userId: string
): Promise<string> {
  const isGm = await isCampaignGm(campaignId, userId);
  if (!isGm) throw new Error("Not authorised");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const code = generateJoinCode();
      await updateCampaignJoinCode(campaignId, code);
      return code;
    } catch (err) {
      const isUniqueViolation =
        err instanceof Error && err.message.includes("campaigns_join_code_unique");
      if (!isUniqueViolation || attempt === 1) throw err;
    }
  }
  throw new Error("Failed to generate unique join code");
}

export async function deleteCampaignForGm(
  campaignId: string,
  userId: string
): Promise<void> {
  const isGm = await isCampaignGm(campaignId, userId);
  if (!isGm) throw new Error("Not authorised");
  await deleteCampaign(campaignId);
}
