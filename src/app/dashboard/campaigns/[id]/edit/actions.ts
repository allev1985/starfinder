"use server";

import { getUser } from "@/lib/session";
import { updateCampaignForGm, regenerateJoinCodeForGm } from "@/services/campaigns";

type Result<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateCampaignAction(
  campaignId: string,
  formData: FormData
): Promise<Result> {
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Campaign name is required." };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await updateCampaignForGm(campaignId, user.id, { name: name.trim() });
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to update campaign." };
  }
}

export async function regenerateJoinCodeAction(
  campaignId: string
): Promise<Result<string>> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    const code = await regenerateJoinCodeForGm(campaignId, user.id);
    return { success: true, data: code };
  } catch {
    return { success: false, error: "Failed to regenerate join code." };
  }
}
