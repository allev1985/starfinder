"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { isCampaignParticipant } from "@/lib/authorization";
import { createSpaceship, updateSpaceship, deleteSpaceship } from "@/db/queries/campaigns";
import type { Spaceship } from "@/db/schema";

type Result = { success: true } | { success: false; error: string };

export async function createSpaceshipAction(campaignId: string, name: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    await createSpaceship({ campaignId, name });
    revalidatePath(`/dashboard/campaigns/${campaignId}/spaceship`);
    revalidatePath(`/dashboard/campaigns/${campaignId}`, "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create spaceship." };
  }
}

export async function updateSpaceshipAction(
  campaignId: string,
  spaceshipId: string,
  data: Partial<Pick<Spaceship, "name" | "makeAndModel" | "speed" | "size" | "frame" | "driftRating">>
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    await updateSpaceship(spaceshipId, data);
    revalidatePath(`/dashboard/campaigns/${campaignId}/spaceship`);
    revalidatePath(`/dashboard/campaigns/${campaignId}`, "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update spaceship." };
  }
}

export async function deleteSpaceshipAction(
  campaignId: string,
  spaceshipId: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    await deleteSpaceship(spaceshipId);
    revalidatePath(`/dashboard/campaigns/${campaignId}/spaceship`);
    revalidatePath(`/dashboard/campaigns/${campaignId}`, "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete spaceship." };
  }
}
