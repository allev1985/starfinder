import "server-only";
import {
  createCampaign,
  getCampaignsForUser,
  updateCampaign,
  updateCampaignJoinCode,
  deleteCampaign,
} from "@/db/queries/campaigns";
import { isCampaignDm } from "@/lib/authorization";
import { getEditionBySlug } from "@/db/queries/reference";
import type { Campaign } from "@/db/schema";

export type CampaignWithRole = Campaign & { role: "dm" | "player" };

export function generateJoinCode(): string {
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
  const edition = await getEditionBySlug("1e");
  if (!edition) throw new Error("Edition '1e' not found.");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await createCampaign({
        name,
        dmId,
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
  const { dmCampaigns, playerCampaigns } = await getCampaignsForUser(userId);

  const map = new Map<string, CampaignWithRole>();

  for (const c of playerCampaigns) {
    map.set(c.id, { ...c, role: "player" });
  }
  for (const c of dmCampaigns) {
    map.set(c.id, { ...c, role: "dm" });
  }

  return Array.from(map.values());
}

export async function updateCampaignForDm(
  campaignId: string,
  userId: string,
  data: { name: string }
): Promise<Campaign> {
  const isDm = await isCampaignDm(campaignId, userId);
  if (!isDm) throw new Error("Not authorised");
  return updateCampaign(campaignId, data);
}

export async function regenerateJoinCodeForDm(
  campaignId: string,
  userId: string
): Promise<string> {
  const isDm = await isCampaignDm(campaignId, userId);
  if (!isDm) throw new Error("Not authorised");

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

export async function deleteCampaignForDm(
  campaignId: string,
  userId: string
): Promise<void> {
  const isDm = await isCampaignDm(campaignId, userId);
  if (!isDm) throw new Error("Not authorised");
  await deleteCampaign(campaignId);
}
