import "server-only";
import {
  createCharacter,
  getCharacterById,
  updateCharacter,
  updateCharacterLevel,
  updateCharacterAbilityScores,
  deleteCharacter,
  deleteCharacterDescriptionValues,
  findCampaignByJoinCode,
  isAlreadyInCampaign,
  joinCampaign,
  upsertCharacterDescriptionValue,
  updateInitiativeMiscMod,
  updateHealthResolve,
  updateBaseAttackBonus,
  updateEacArmorBonus,
  updateEacMiscMod,
  updateKacArmorBonus,
  updateKacMiscMod,
  updateFortBaseSave,
  updateFortMiscMod,
  updateRefBaseSave,
  updateRefMiscMod,
  updateWillBaseSave,
  updateWillMiscMod,
  updateMeleeAttackMiscMod,
  updateRangedAttackMiscMod,
  updateThrownAttackMiscMod,
  updateMechanicLink,
  upsertCharacterSkills,
  deleteCharacterSkill,
  deleteCharacterSkillsBySkillId,
  updateCharacterSkillRanks,
  updateCharacterSkillMiscMod,
  type AbilityScores,
  type HealthResolveValues,
  type SkillEntry,
} from "@/db/queries/characters";
import { getRaceById, getChassisById } from "@/db/queries/reference";
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
  chassisId,
  skillUnitSkillId,
}: {
  name: string;
  ownerId: string;
  raceId: string;
  classId: string;
  themeId: string | null;
  chassisId?: string | null;
  skillUnitSkillId?: string | null;
}): Promise<Character> {
  let abilityOverrides: Partial<{
    strScore: number; dexScore: number; intScore: number; wisScore: number; chaScore: number;
  }> = {};

  if (chassisId) {
    const ch = await getChassisById(chassisId);
    if (ch) {
      abilityOverrides = {
        strScore: ch.defaultStr,
        dexScore: ch.defaultDex,
        intScore: ch.defaultInt,
        wisScore: ch.defaultWis,
        chaScore: ch.defaultCha,
      };
    }
  }

  return createCharacter(
    { name, ownerId, raceId, classId, themeId, chassisId: chassisId ?? null, ...abilityOverrides },
    { skillUnitSkillId: skillUnitSkillId ?? null }
  );
}

export async function updateMechanicLinkForOwner(
  characterId: string,
  userId: string,
  mechanicCharacterId: string | null
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateMechanicLink(characterId, mechanicCharacterId);
}

export async function updateCharacterForOwner(
  characterId: string,
  userId: string,
  data: { name: string; raceId?: string | null; classId?: string | null; themeId?: string | null; chassisId?: string | null }
): Promise<Character> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  if (data.raceId !== undefined) {
    const current = await getCharacterById(characterId);
    if (current && current.raceId !== data.raceId) {
      const [oldRace, newRace] = await Promise.all([
        current.raceId ? getRaceById(current.raceId) : null,
        data.raceId ? getRaceById(data.raceId) : null,
      ]);
      if (oldRace?.type !== newRace?.type) {
        await deleteCharacterDescriptionValues(characterId);
      }
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

export async function upsertDescriptionValueForOwner(
  characterId: string,
  userId: string,
  descriptionId: string,
  value: string
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await upsertCharacterDescriptionValue(characterId, descriptionId, value);
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

export async function updateFortBaseSaveForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateFortBaseSave(characterId, value);
}

export async function updateFortMiscModForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateFortMiscMod(characterId, value);
}

export async function updateRefBaseSaveForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateRefBaseSave(characterId, value);
}

export async function updateRefMiscModForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateRefMiscMod(characterId, value);
}

export async function updateWillBaseSaveForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateWillBaseSave(characterId, value);
}

export async function updateWillMiscModForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateWillMiscMod(characterId, value);
}

export async function updateMeleeAttackMiscModForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateMeleeAttackMiscMod(characterId, value);
}

export async function updateRangedAttackMiscModForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateRangedAttackMiscMod(characterId, value);
}

export async function updateThrownAttackMiscModForOwner(characterId: string, userId: string, value: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateThrownAttackMiscMod(characterId, value);
}

export async function saveCharacterSkillsForOwner(
  characterId: string,
  userId: string,
  added: SkillEntry[],
  removedIds: string[],
  removedBySkillId: { skillId: string }[]
): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  for (const { skillId } of removedBySkillId) {
    await deleteCharacterSkillsBySkillId(characterId, skillId);
  }
  for (const id of removedIds) {
    await deleteCharacterSkill(id);
  }
  await upsertCharacterSkills(characterId, added);
}

export async function updateSkillRanksForOwner(id: string, characterId: string, userId: string, ranks: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateCharacterSkillRanks(id, ranks);
}

export async function updateSkillMiscModForOwner(id: string, characterId: string, userId: string, miscMod: number): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await updateCharacterSkillMiscMod(id, miscMod);
}

export async function removeCharacterSkillForOwner(id: string, characterId: string, userId: string): Promise<void> {
  if (!(await isCharacterOwner(characterId, userId))) throw new NotOwnerError();
  await deleteCharacterSkill(id);
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
