"use server";

import { getUser } from "@/lib/session";
import {
  deleteCharacterForOwner,
  joinCampaignForOwner,
  updateCharacterLevelForOwner,
  updateAbilityScoresForOwner,
  upsertDescriptionValueForOwner,
  updateInitiativeMiscModForOwner,
  updateHealthResolveForOwner,
  updateBaseAttackBonusForOwner,
  addArmorForOwner,
  removeArmorForOwner,
  toggleArmorWornForOwner,
  updateEacMiscModForOwner,
  updateKacMiscModForOwner,
  updateFortBaseSaveForOwner,
  updateFortMiscModForOwner,
  updateRefBaseSaveForOwner,
  updateRefMiscModForOwner,
  updateWillBaseSaveForOwner,
  updateWillMiscModForOwner,
  updateMeleeAttackMiscModForOwner,
  updateRangedAttackMiscModForOwner,
  updateThrownAttackMiscModForOwner,
  saveCharacterSkillsForOwner,
  updateSkillRanksForOwner,
  updateSkillMiscModForOwner,
  removeCharacterSkillForOwner,
  updateMechanicLinkForOwner,
  addCharacterWeaponForOwner,
  removeCharacterWeaponForOwner,
  addCharacterEquipmentForOwner,
  removeCharacterEquipmentForOwner,
  updateCharacterEquipmentQuantityForOwner,
  NotOwnerError,
  InvalidJoinCodeError,
  AlreadyInCampaignError,
} from "@/services/characters";
import type { AbilityScores, HealthResolveValues, SkillEntry } from "@/db/queries/characters";

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

export async function upsertDescriptionValueAction(
  characterId: string,
  descriptionId: string,
  value: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await upsertDescriptionValueForOwner(characterId, user.id, descriptionId, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save description." };
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

export async function addArmorAction(characterId: string, armorId: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await addArmorForOwner(characterId, user.id, armorId);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to add armor." };
  }
}

export async function removeArmorAction(characterArmorId: string, characterId: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await removeArmorForOwner(characterArmorId, user.id, characterId);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to remove armor." };
  }
}

export async function toggleArmorWornAction(characterArmorId: string, characterId: string, worn: boolean): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await toggleArmorWornForOwner(characterArmorId, user.id, characterId, worn);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to update worn armor." };
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

export async function updateFortBaseSaveAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateFortBaseSaveForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save Fortitude base save." };
  }
}

export async function updateFortMiscModAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateFortMiscModForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save Fortitude misc modifier." };
  }
}

export async function updateRefBaseSaveAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateRefBaseSaveForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save Reflex base save." };
  }
}

export async function updateRefMiscModAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateRefMiscModForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save Reflex misc modifier." };
  }
}

export async function updateWillBaseSaveAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateWillBaseSaveForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save Will base save." };
  }
}

export async function updateWillMiscModAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateWillMiscModForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save Will misc modifier." };
  }
}

export async function updateMeleeAttackMiscModAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateMeleeAttackMiscModForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save melee attack misc modifier." };
  }
}

export async function updateRangedAttackMiscModAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateRangedAttackMiscModForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save ranged attack misc modifier." };
  }
}

export async function updateThrownAttackMiscModAction(characterId: string, value: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateThrownAttackMiscModForOwner(characterId, user.id, value);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save thrown attack misc modifier." };
  }
}

export async function saveCharacterSkillsAction(
  characterId: string,
  added: SkillEntry[],
  removedIds: string[],
  removedBySkillId: { skillId: string }[]
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await saveCharacterSkillsForOwner(characterId, user.id, added, removedIds, removedBySkillId);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save skills." };
  }
}

export async function updateSkillRanksAction(
  id: string,
  characterId: string,
  ranks: number
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateSkillRanksForOwner(id, characterId, user.id, ranks);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save ranks." };
  }
}

export async function updateSkillMiscModAction(
  id: string,
  characterId: string,
  miscMod: number
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateSkillMiscModForOwner(id, characterId, user.id, miscMod);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to save misc modifier." };
  }
}

export async function removeCharacterSkillAction(
  id: string,
  characterId: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await removeCharacterSkillForOwner(id, characterId, user.id);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to remove skill." };
  }
}

export async function updateMechanicLinkAction(
  characterId: string,
  mechanicCharacterId: string | null
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateMechanicLinkForOwner(characterId, user.id, mechanicCharacterId);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to update mechanic link." };
  }
}

export async function addWeaponAction(characterId: string, weaponId: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await addCharacterWeaponForOwner(characterId, user.id, weaponId);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to add weapon." };
  }
}

export async function removeWeaponAction(characterId: string, weaponId: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await removeCharacterWeaponForOwner(characterId, user.id, weaponId);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to remove weapon." };
  }
}

export async function addEquipmentAction(characterId: string, equipmentId: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await addCharacterEquipmentForOwner(characterId, user.id, equipmentId);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to add equipment." };
  }
}

export async function removeEquipmentAction(characterEquipmentId: string, characterId: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await removeCharacterEquipmentForOwner(characterEquipmentId, user.id, characterId);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to remove equipment." };
  }
}

export async function updateEquipmentQuantityAction(characterEquipmentId: string, characterId: string, quantity: number): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };
  try {
    await updateCharacterEquipmentQuantityForOwner(characterEquipmentId, user.id, characterId, quantity);
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to update quantity." };
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
