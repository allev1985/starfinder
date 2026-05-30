import "server-only";
import {
  createCharacter,
  updateCharacter,
  updateCharacterLevel,
  deleteCharacter,
  findCampaignByJoinCode,
  isAlreadyInCampaign,
  joinCampaign,
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
