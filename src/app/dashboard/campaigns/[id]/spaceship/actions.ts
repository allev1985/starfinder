"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { isCampaignParticipant } from "@/lib/authorization";
import { createSpaceship, updateSpaceship, deleteSpaceship, createSpaceshipWeapon, deleteSpaceshipWeapon, createSpaceshipNote, updateSpaceshipNote, deleteSpaceshipNote, assignCrew, removeCrew } from "@/db/queries/campaigns";
import type { Spaceship, SpaceshipWeapon, SpaceshipNote, SpaceshipCrew, CrewRole } from "@/db/schema";

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

export async function createSpaceshipNoteAction(
  campaignId: string,
  spaceshipId: string,
  section: string,
  note: string
): Promise<{ success: true; note: SpaceshipNote } | { success: false; error: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    const created = await createSpaceshipNote({ spaceshipId, section, note });
    return { success: true, note: created };
  } catch {
    return { success: false, error: "Failed to create note." };
  }
}

export async function updateSpaceshipNoteAction(
  campaignId: string,
  noteId: string,
  note: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    await updateSpaceshipNote(noteId, note);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update note." };
  }
}

export async function deleteSpaceshipNoteAction(
  campaignId: string,
  noteId: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    await deleteSpaceshipNote(noteId);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete note." };
  }
}

export async function assignCrewAction(
  campaignId: string,
  spaceshipId: string,
  characterId: string,
  role: CrewRole
): Promise<{ success: true; crew: SpaceshipCrew } | { success: false; error: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    const crew = await assignCrew(spaceshipId, characterId, role);
    return { success: true, crew };
  } catch {
    return { success: false, error: "Failed to assign crew." };
  }
}

export async function removeCrewAction(
  campaignId: string,
  crewId: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    await removeCrew(crewId);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to remove crew member." };
  }
}
