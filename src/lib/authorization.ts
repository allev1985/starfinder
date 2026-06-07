import "server-only";
import {
  checkIsCampaignGm,
  checkHasCharacterOwnerInCampaign,
} from "@/db/queries/campaigns";
import {
  checkIsCharacterOwner,
  getCharacterCampaignIds,
} from "@/db/queries/characters";

export async function isCampaignParticipant(
  campaignId: string,
  userId: string
): Promise<boolean> {
  if (await checkIsCampaignGm(campaignId, userId)) return true;
  return checkHasCharacterOwnerInCampaign(campaignId, userId);
}

export async function isCampaignGm(
  campaignId: string,
  userId: string
): Promise<boolean> {
  return checkIsCampaignGm(campaignId, userId);
}

export async function isCharacterOwner(
  characterId: string,
  userId: string
): Promise<boolean> {
  return checkIsCharacterOwner(characterId, userId);
}

export async function canViewCharacter(
  characterId: string,
  userId: string
): Promise<boolean> {
  if (await checkIsCharacterOwner(characterId, userId)) return true;

  const campaignIds = await getCharacterCampaignIds(characterId);
  for (const campaignId of campaignIds) {
    if (await isCampaignParticipant(campaignId, userId)) return true;
  }
  return false;
}
