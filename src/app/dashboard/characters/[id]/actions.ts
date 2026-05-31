"use server";

import { getUser } from "@/lib/session";
import {
  deleteCharacterForOwner,
  joinCampaignForOwner,
  updateCharacterLevelForOwner,
  updateAbilityScoresForOwner,
  upsertRaceAttributeValueForOwner,
  updateInitiativeMiscModForOwner,
  updateHealthResolveForOwner,
  updateBaseAttackBonusForOwner,
  updateEacArmorBonusForOwner,
  updateEacMiscModForOwner,
  updateKacArmorBonusForOwner,
  updateKacMiscModForOwner,
  NotOwnerError,
  InvalidJoinCodeError,
  AlreadyInCampaignError,
} from "@/services/characters";
import type { AbilityScores, HealthResolveValues } from "@/db/queries/characters";

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

export async function updateAbilityScoresAction(
  characterId: string,
  scores: AbilityScores
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await updateAbilityScoresForOwner(characterId, user.id, scores);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save ability scores." };
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

export async function updateInitiativeMiscModAction(
  characterId: string,
  value: number
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await updateInitiativeMiscModForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save initiative modifier." };
  }
}

export async function updateBaseAttackBonusAction(
  characterId: string,
  value: number
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await updateBaseAttackBonusForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save base attack bonus." };
  }
}

export async function updateHealthResolveAction(
  characterId: string,
  raw: HealthResolveValues
): Promise<Result> {
  const parse = (v: number) => (isNaN(v) ? 0 : v);
  const values: HealthResolveValues = {
    staminaPointsTotal: parse(raw.staminaPointsTotal),
    staminaPointsCurrent: parse(raw.staminaPointsCurrent),
    hitPointsTotal: parse(raw.hitPointsTotal),
    hitPointsCurrent: parse(raw.hitPointsCurrent),
    resolvePointsTotal: parse(raw.resolvePointsTotal),
    resolvePointsCurrent: parse(raw.resolvePointsCurrent),
  };

  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await updateHealthResolveForOwner(characterId, user.id, values);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save health & resolve." };
  }
}

export async function updateEacArmorBonusAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateEacArmorBonusForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save EAC armor bonus." };
  }
}

export async function updateEacMiscModAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateEacMiscModForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save EAC misc modifier." };
  }
}

export async function updateKacArmorBonusAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateKacArmorBonusForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save KAC armor bonus." };
  }
}

export async function updateKacMiscModAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateKacMiscModForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save KAC misc modifier." };
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
