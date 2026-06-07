"use server";

import { getUser } from "@/lib/session";
import { createCampaignForUser } from "@/services/campaigns";

type Result =
  | { success: true; campaignId: string }
  | { success: false; error: string };

export async function createCampaignAction(formData: FormData): Promise<Result> {
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Campaign name is required." };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "You must be signed in to create a campaign." };

  try {
    const campaign = await createCampaignForUser({ name: name.trim(), gmId: user.id });
    return { success: true, campaignId: campaign.id };
  } catch {
    return { success: false, error: "Failed to create campaign. Please try again." };
  }
}
