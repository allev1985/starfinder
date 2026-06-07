"use server";

import { getUser } from "@/lib/session";
import { deleteCampaignForGm } from "@/services/campaigns";

type Result = { success: true } | { success: false; error: string };

export async function deleteCampaignAction(campaignId: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await deleteCampaignForGm(campaignId, user.id);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete campaign." };
  }
}
