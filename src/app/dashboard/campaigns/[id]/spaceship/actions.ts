"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { isCampaignParticipant } from "@/lib/authorization";
import { createSpaceship, updateSpaceship, deleteSpaceship, createSpaceshipWeapon, deleteSpaceshipWeapon } from "@/db/queries/campaigns";
import type { Spaceship, SpaceshipWeapon } from "@/db/schema";

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
  data: Partial<Pick<Spaceship, "name" | "makeAndModel" | "speed" | "size" | "frame" | "driftRating" | "pilotRank" | "sizeMod" | "armorBonus" | "acMiscMod" | "countermeasures" | "tlMiscMod" | "hullTotal" | "hullCurrent" | "damageThreshold" | "criticalThreshold" | "shieldForwardTotal" | "shieldForwardCurrent" | "shieldPortTotal" | "shieldPortCurrent" | "shieldStarboardTotal" | "shieldStarboardCurrent" | "shieldAftTotal" | "shieldAftCurrent" | "shieldRegenPerMin" | "shieldMiscMod">>
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

export async function createWeaponAction(
  campaignId: string,
  spaceshipId: string,
  data: { arc: string; name: string; damage?: string; range?: string; special?: string }
): Promise<{ success: true; weapon: SpaceshipWeapon } | { success: false; error: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    const weapon = await createSpaceshipWeapon({
      spaceshipId,
      arc: data.arc,
      name: data.name,
      damage: data.damage || null,
      range: data.range || null,
      special: data.special || null,
    });
    return { success: true, weapon };
  } catch {
    return { success: false, error: "Failed to create weapon." };
  }
}

export async function deleteWeaponAction(
  campaignId: string,
  weaponId: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    await deleteSpaceshipWeapon(weaponId);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete weapon." };
  }
}
