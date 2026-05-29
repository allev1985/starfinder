import "server-only";
import {
  createCharacter,
  updateCharacter,
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
}: {
  name: string;
  ownerId: string;
}): Promise<Character> {
  return createCharacter({ name, ownerId });
}

export async function updateCharacterForOwner(
  characterId: string,
  userId: string,
  data: { name: string }
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
