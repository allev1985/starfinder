import "server-only";
import {
  createCharacter,
  getCharacterById,
  updateCharacter,
  updateCharacterLevel,
  updateCharacterAbilityScores,
  deleteCharacter,
  deleteCharacterRaceAttributeValues,
  findCampaignByJoinCode,
  isAlreadyInCampaign,
  joinCampaign,
  upsertCharacterRaceAttributeValue,
  updateInitiativeMiscMod,
  updateHealthResolve,
  updateBaseAttackBonus,
  updateEacArmorBonus,
  updateEacMiscMod,
  updateKacArmorBonus,
  updateKacMiscMod,
  type AbilityScores,
  type HealthResolveValues,
} from "@/db/queries/characters";
import { isCharacterOwner } from "@/lib/authorization";
import type { Character } from "@/db/schema";

export class NotOwnerError extends Error {}
export class InvalidJoinCodeError extends Error {}
export class AlreadyInCampaignError extends Error {}

export async function createCharacterForUser({
  name,
  ownerId,
  raceId,
  classId,
  themeId,
}: {
  name: string;
  ownerId: string;
  raceId: string;
  classId: string;
  themeId: string;
}): Promise<Character> {
  return createCharacter({ name, ownerId, raceId, classId, themeId });
}

export async function updateCharacterForOwner(
  characterId: string,
  userId: string,
  data: { name: string; raceId?: string | null; classId?: string | null; themeId?: string | null }
): Promise<Character> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  if (data.raceId !== undefined) {
    const current = await getCharacterById(characterId);
    if (current && current.raceId !== data.raceId) {
      await deleteCharacterRaceAttributeValues(characterId);
    }
  }
  return updateCharacter(characterId, data);
}

export async function deleteCharacterForOwner(
  characterId: string,
  userId: string
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await deleteCharacter(characterId);
}

export async function updateCharacterLevelForOwner(
  characterId: string,
  userId: string,
  level: number
): Promise<Character> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  if (level < 1 || level > 20) throw new Error("Level must be between 1 and 20.");
  return updateCharacterLevel(characterId, level);
}

export async function upsertRaceAttributeValueForOwner(
  characterId: string,
  userId: string,
  attributeId: string,
  value: string
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await upsertCharacterRaceAttributeValue(characterId, attributeId, value);
}

export async function updateAbilityScoresForOwner(
  characterId: string,
  userId: string,
  scores: AbilityScores
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateCharacterAbilityScores(characterId, scores);
}

export async function updateInitiativeMiscModForOwner(
  characterId: string,
  userId: string,
  value: number
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateInitiativeMiscMod(characterId, value);
}

export async function updateHealthResolveForOwner(
  characterId: string,
  userId: string,
  values: HealthResolveValues
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateHealthResolve(characterId, values);
}

export async function updateBaseAttackBonusForOwner(
  characterId: string,
  userId: string,
  value: number
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateBaseAttackBonus(characterId, value);
}

export async function updateEacArmorBonusForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateEacArmorBonus(characterId, value);
}

export async function updateEacMiscModForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateEacMiscMod(characterId, value);
}

export async function updateKacArmorBonusForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateKacArmorBonus(characterId, value);
}

export async function updateKacMiscModForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateKacMiscMod(characterId, value);
}

export async function joinCampaignForOwner(
  characterId: string,
  userId: string,
  joinCode: string
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();

  const campaign = await findCampaignByJoinCode(joinCode.trim().toUpperCase());
  if (!campaign) throw new InvalidJoinCodeError();

  if (await isAlreadyInCampaign(campaign.id, characterId)) {
    throw new AlreadyInCampaignError();
  }

  await joinCampaign(campaign.id, characterId);
}
