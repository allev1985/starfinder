"use server";

import { getUser } from "@/lib/session";
import {
  deleteCharacterForOwner,
  joinCampaignForOwner,
  updateCharacterLevelForOwner,
  upsertRaceAttributeValueForOwner,
  NotOwnerError,
  InvalidJoinCodeError,
  AlreadyInCampaignError,
} from "@/services/characters";

type Result = { success: true } | { success: false; error: string };

export async function deleteCharacterAction(characterId: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await deleteCharacterForOwner(characterId, user.id);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to delete character." };
  }
}

export async function updateCharacterLevelAction(
  characterId: string,
  level: number
): Promise<Result> {
  if (level < 1 || level > 20) {
    return { success: false, error: "Level must be between 1 and 20." };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await updateCharacterLevelForOwner(characterId, user.id, level);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to update level." };
  }
}

export async function upsertRaceAttributeValueAction(
  characterId: string,
  attributeId: string,
  value: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await upsertRaceAttributeValueForOwner(characterId, user.id, attributeId, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save attribute." };
  }
}

export async function joinCampaignAction(
  characterId: string,
  formData: FormData
): Promise<Result> {
  const joinCode = formData.get("joinCode");
  if (typeof joinCode !== "string" || joinCode.trim().length === 0) {
    return { success: false, error: "Join code is required." };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await joinCampaignForOwner(characterId, user.id, joinCode);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    if (err instanceof InvalidJoinCodeError) return { success: false, error: "Invalid join code." };
    if (err instanceof AlreadyInCampaignError) return { success: false, error: "Character is already in that campaign." };
    return { success: false, error: "Failed to join campaign." };
  }
}
