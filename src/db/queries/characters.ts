import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  characters,
  campaigns,
  campaignCharacters,
  races,
  classes,
  themes,
  chassis,
  armor,
  characterArmor,
  characterDescriptions,
  characterCombatStats,
  characterSkills,
  characterWeapons,
  characterEquipment,
  characterClassChoices,
  characterFeats,
  feats,
  equipment,
  skills,
  type NewCharacter,
  type Character,
  type Campaign,
  type CharacterDescription,
  type CharacterCombatStats,
  type CharacterSkill,
  type Armor,
  type Equipment,
  type CharacterClassChoice,
  type NewCharacterClassChoice,
  type NewCharacterFeat,
} from "@/db/schema";

export async function getCharactersByOwner(ownerId: string): Promise<Character[]> {
  return db.select().from(characters).where(eq(characters.ownerId, ownerId));
}

export type CharacterListItem = {
  id: string;
  name: string;
  level: number;
  raceName: string | null;
  className: string | null;
  themeName: string | null;
};

export async function getCharacterListByOwner(ownerId: string): Promise<CharacterListItem[]> {
  const rows = await db
    .select({
      id: characters.id,
      name: characters.name,
      level: characters.level,
      raceName: races.name,
      className: classes.name,
      themeName: themes.name,
    })
    .from(characters)
    .leftJoin(races, eq(characters.raceId, races.id))
    .leftJoin(classes, eq(characters.classId, classes.id))
    .leftJoin(themes, eq(characters.themeId, themes.id))
    .where(eq(characters.ownerId, ownerId));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    level: r.level,
    raceName: r.raceName ?? null,
    className: r.className ?? null,
    themeName: r.themeName ?? null,
  }));
}

export async function getCharacterById(id: string): Promise<Character | null> {
  const [character] = await db.select().from(characters).where(eq(characters.id, id)).limit(1);
  return character ?? null;
}

export async function createCharacter(
  data: NewCharacter,
  { skillUnitSkillId }: { skillUnitSkillId?: string | null } = {}
): Promise<Character> {
  const [character] = await db.insert(characters).values(data).returning();
  await db.insert(characterCombatStats).values({ characterId: character.id });

  const race = data.raceId
    ? (await db.select({ type: races.type }).from(races).where(eq(races.id, data.raceId)).limit(1))[0]
    : null;

  if (race?.type === "drone") {
    const skillIds = new Set<string>();
    if (skillUnitSkillId) skillIds.add(skillUnitSkillId);
    if (data.chassisId) {
      const [ch] = await db.select({ bonusSkillId: chassis.bonusSkillId }).from(chassis).where(eq(chassis.id, data.chassisId)).limit(1);
      if (ch?.bonusSkillId) skillIds.add(ch.bonusSkillId);
    }
    if (skillIds.size > 0) {
      await db.insert(characterSkills).values(
        [...skillIds].map((skillId) => ({ characterId: character.id, skillId, ranks: 0, miscMod: 0 }))
      );
    }
  } else {
    const untrainedSkills = await db
      .select({ id: skills.id })
      .from(skills)
      .where(eq(skills.trainedOnly, false));
    if (untrainedSkills.length > 0) {
      await db.insert(characterSkills).values(
        untrainedSkills.map((s) => ({ characterId: character.id, skillId: s.id, ranks: 0, miscMod: 0 }))
      );
    }
  }
  return character;
}

export async function updateCharacter(
  id: string,
  data: { name: string; raceId?: string | null; classId?: string | null; themeId?: string | null; chassisId?: string | null }
): Promise<Character> {
  const [updated] = await db
    .update(characters)
    .set(data)
    .where(eq(characters.id, id))
    .returning();
  return updated;
}

export async function updateCharacterLevel(
  id: string,
  level: number
): Promise<Character> {
  const [updated] = await db
    .update(characters)
    .set({ level })
    .where(eq(characters.id, id))
    .returning();
  return updated;
}

export async function deleteCharacter(id: string): Promise<void> {
  await db.update(characters).set({ mechanicCharacterId: null }).where(eq(characters.mechanicCharacterId, id));
  await db.delete(campaignCharacters).where(eq(campaignCharacters.characterId, id));
  await db.delete(characters).where(eq(characters.id, id));
}

export type CharacterWithMeta = Character & {
  raceName: string | null;
  raceType: import("@/db/schema").RaceType | null;
  className: string | null;
  themeName: string | null;
  level: number;
  skillRanksPerLevel: number;
  isSpellcaster: boolean;
  chassisName: string | null;
  mechanicName: string | null;
  mechanicLevel: number | null;
  mechanicIntScore: number | null;
  equippedArmor: Armor | null;
};

const mechanic = db.select().from(characters).as("mechanic");

export async function getCharacterWithCampaigns(
  characterId: string
): Promise<{ character: CharacterWithMeta | null; campaigns: Campaign[] }> {
  const wornArmor = db.select().from(characterArmor).as("worn_armor");

  const [row] = await db
    .select({
      id: characters.id,
      name: characters.name,
      ownerId: characters.ownerId,
      raceId: characters.raceId,
      classId: characters.classId,
      themeId: characters.themeId,
      chassisId: characters.chassisId,
      mechanicCharacterId: characters.mechanicCharacterId,
      level: characters.level,
      strScore: characters.strScore,
      dexScore: characters.dexScore,
      conScore: characters.conScore,
      intScore: characters.intScore,
      wisScore: characters.wisScore,
      chaScore: characters.chaScore,
      credits: characters.credits,
      xpEarned: characters.xpEarned,
      languages: characters.languages,
      createdAt: characters.createdAt,
      raceName: races.name,
      raceType: races.type,
      className: classes.name,
      themeName: themes.name,
      skillRanksPerLevel: classes.skillRanksPerLevel,
      isSpellcaster: classes.isSpellcaster,
      chassisName: chassis.name,
      mechanicName: mechanic.name,
      mechanicLevel: mechanic.level,
      mechanicIntScore: mechanic.intScore,
      armor: armor,
    })
    .from(characters)
    .leftJoin(races, eq(characters.raceId, races.id))
    .leftJoin(classes, eq(characters.classId, classes.id))
    .leftJoin(themes, eq(characters.themeId, themes.id))
    .leftJoin(chassis, eq(characters.chassisId, chassis.id))
    .leftJoin(mechanic, eq(characters.mechanicCharacterId, mechanic.id))
    .leftJoin(wornArmor, and(eq(wornArmor.characterId, characters.id), eq(wornArmor.worn, true)))
    .leftJoin(armor, eq(armor.id, wornArmor.armorId))
    .where(eq(characters.id, characterId));

  if (!row) return { character: null, campaigns: [] };

  const character: CharacterWithMeta = {
    id: row.id,
    name: row.name,
    ownerId: row.ownerId,
    raceId: row.raceId,
    classId: row.classId,
    themeId: row.themeId,
    chassisId: row.chassisId,
    mechanicCharacterId: row.mechanicCharacterId,
    level: row.level,
    strScore: row.strScore,
    dexScore: row.dexScore,
    conScore: row.conScore,
    intScore: row.intScore,
    wisScore: row.wisScore,
    chaScore: row.chaScore,
    credits: row.credits,
    xpEarned: row.xpEarned,
    languages: row.languages,
    createdAt: row.createdAt,
    raceName: row.raceName ?? null,
    raceType: row.raceType ?? null,
    className: row.className ?? null,
    themeName: row.themeName ?? null,
    skillRanksPerLevel: row.skillRanksPerLevel ?? 0,
    isSpellcaster: row.isSpellcaster ?? false,
    chassisName: row.chassisName ?? null,
    mechanicName: row.mechanicName ?? null,
    mechanicLevel: row.mechanicLevel ?? null,
    mechanicIntScore: row.mechanicIntScore ?? null,
    equippedArmor: row.armor ?? null,
  };

  const joined = await db
    .select({ campaign: campaigns })
    .from(campaigns)
    .innerJoin(campaignCharacters, eq(campaignCharacters.campaignId, campaigns.id))
    .where(eq(campaignCharacters.characterId, characterId))
    .then((rows) => rows.map((r) => r.campaign));

  return { character, campaigns: joined };
}

export async function findCampaignByJoinCode(
  code: string
): Promise<Campaign | null> {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.joinCode, code));
  return campaign ?? null;
}

export async function isAlreadyInCampaign(
  campaignId: string,
  characterId: string
): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(campaignCharacters)
    .where(
      and(
        eq(campaignCharacters.campaignId, campaignId),
        eq(campaignCharacters.characterId, characterId)
      )
    )
    .limit(1);
  return !!existing;
}

export async function joinCampaign(
  campaignId: string,
  characterId: string
): Promise<void> {
  await db.insert(campaignCharacters).values({ campaignId, characterId });
}

export async function checkIsCharacterOwner(
  characterId: string,
  userId: string
): Promise<boolean> {
  const [row] = await db
    .select({ id: characters.id })
    .from(characters)
    .where(and(eq(characters.id, characterId), eq(characters.ownerId, userId)))
    .limit(1);
  return !!row;
}

export async function getCharacterCampaignIds(
  characterId: string
): Promise<string[]> {
  const rows = await db
    .select({ campaignId: campaignCharacters.campaignId })
    .from(campaignCharacters)
    .where(eq(campaignCharacters.characterId, characterId));
  return rows.map((r) => r.campaignId);
}

export async function getCharacterDescriptionValues(
  characterId: string
): Promise<CharacterDescription[]> {
  return db
    .select()
    .from(characterDescriptions)
    .where(eq(characterDescriptions.characterId, characterId));
}

export async function deleteCharacterDescriptionValues(characterId: string): Promise<void> {
  await db
    .delete(characterDescriptions)
    .where(eq(characterDescriptions.characterId, characterId));
}

export type AbilityScores = {
  strScore: number;
  dexScore: number;
  conScore: number;
  intScore: number;
  wisScore: number;
  chaScore: number;
};

export async function updateCharacterAbilityScores(
  id: string,
  scores: AbilityScores
): Promise<Character> {
  const [updated] = await db
    .update(characters)
    .set(scores)
    .where(eq(characters.id, id))
    .returning();
  return updated;
}

export async function getCharacterCombatStats(
  characterId: string
): Promise<CharacterCombatStats | null> {
  const [row] = await db
    .select()
    .from(characterCombatStats)
    .where(eq(characterCombatStats.characterId, characterId))
    .limit(1);
  return row ?? null;
}

export async function updateInitiativeMiscMod(
  characterId: string,
  value: number
): Promise<void> {
  await db
    .update(characterCombatStats)
    .set({ initiativeMiscMod: value })
    .where(eq(characterCombatStats.characterId, characterId));
}

export type HealthResolveValues = {
  staminaPointsTotal: number;
  staminaPointsCurrent: number;
  hitPointsTotal: number;
  hitPointsCurrent: number;
  resolvePointsTotal: number;
  resolvePointsCurrent: number;
};

export async function updateHealthResolve(
  characterId: string,
  values: HealthResolveValues
): Promise<void> {
  await db
    .update(characterCombatStats)
    .set(values)
    .where(eq(characterCombatStats.characterId, characterId));
}

export type MechanicPickerEntry = {
  id: string;
  name: string;
  className: string | null;
  level: number;
  intScore: number;
  isMechanic: boolean;
};

export async function getCharactersForMechanicPicker(
  droneCharacterId: string
): Promise<MechanicPickerEntry[]> {
  const drone = await getCharacterById(droneCharacterId);
  if (!drone) return [];

  const rows = await db
    .select({
      id: characters.id,
      name: characters.name,
      className: classes.name,
      level: characters.level,
      intScore: characters.intScore,
    })
    .from(characters)
    .leftJoin(classes, eq(characters.classId, classes.id))
    .where(eq(characters.ownerId, drone.ownerId));

  return rows
    .filter((r) => r.id !== droneCharacterId)
    .map((r) => ({
      id: r.id,
      name: r.name,
      className: r.className ?? null,
      level: r.level,
      intScore: r.intScore,
      isMechanic: r.className === "Mechanic",
    }))
    .sort((a, b) => {
      if (a.isMechanic !== b.isMechanic) return a.isMechanic ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export async function updateMechanicLink(
  characterId: string,
  mechanicCharacterId: string | null
): Promise<void> {
  await db
    .update(characters)
    .set({ mechanicCharacterId })
    .where(eq(characters.id, characterId));
}

export async function updateBaseAttackBonus(
  characterId: string,
  value: number
): Promise<void> {
  await db
    .update(characterCombatStats)
    .set({ baseAttackBonus: value })
    .where(eq(characterCombatStats.characterId, characterId));
}

export type CharacterArmorEntry = {
  id: string;
  armorId: string;
  worn: boolean;
  armor: Armor;
};

export async function getCharacterArmor(characterId: string): Promise<CharacterArmorEntry[]> {
  const rows = await db
    .select({ id: characterArmor.id, armorId: characterArmor.armorId, worn: characterArmor.worn, armor })
    .from(characterArmor)
    .innerJoin(armor, eq(armor.id, characterArmor.armorId))
    .where(eq(characterArmor.characterId, characterId))
    .orderBy(asc(armor.itemLevel));
  return rows;
}

export async function addCharacterArmor(characterId: string, armorId: string): Promise<CharacterArmorEntry> {
  const [row] = await db
    .insert(characterArmor)
    .values({ characterId, armorId, worn: false })
    .returning();
  const [entry] = await db
    .select({ id: characterArmor.id, armorId: characterArmor.armorId, worn: characterArmor.worn, armor })
    .from(characterArmor)
    .innerJoin(armor, eq(armor.id, characterArmor.armorId))
    .where(eq(characterArmor.id, row.id));
  return entry;
}

export async function removeCharacterArmor(characterArmorId: string): Promise<void> {
  await db.delete(characterArmor).where(eq(characterArmor.id, characterArmorId));
}

export async function toggleCharacterArmorWorn(characterArmorId: string, characterId: string): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.update(characterArmor).set({ worn: false }).where(eq(characterArmor.characterId, characterId));
    await tx.update(characterArmor).set({ worn: true }).where(eq(characterArmor.id, characterArmorId));
  });
}

export async function unsetCharacterArmorWorn(characterArmorId: string): Promise<void> {
  await db.update(characterArmor).set({ worn: false }).where(eq(characterArmor.id, characterArmorId));
}

export async function updateEacMiscMod(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ eacMiscMod: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateKacMiscMod(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ kacMiscMod: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateFortBaseSave(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ fortBaseSave: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateFortMiscMod(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ fortMiscMod: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateRefBaseSave(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ refBaseSave: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateRefMiscMod(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ refMiscMod: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateWillBaseSave(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ willBaseSave: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateWillMiscMod(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ willMiscMod: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateMeleeAttackMiscMod(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ meleeAttackMiscMod: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateRangedAttackMiscMod(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ rangedAttackMiscMod: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function updateThrownAttackMiscMod(characterId: string, value: number): Promise<void> {
  await db.update(characterCombatStats).set({ thrownAttackMiscMod: value }).where(eq(characterCombatStats.characterId, characterId));
}

export async function getCharacterSkills(characterId: string): Promise<CharacterSkill[]> {
  return db
    .select()
    .from(characterSkills)
    .where(eq(characterSkills.characterId, characterId));
}

export type SkillEntry = {
  skillId: string;
  label?: string | null;
  abilityOverride?: string | null;
  ranks: number;
  miscMod: number;
};

export async function upsertCharacterSkills(
  characterId: string,
  skills: SkillEntry[]
): Promise<void> {
  if (skills.length === 0) return;
  await db.insert(characterSkills).values(
    skills.map((s) => ({
      characterId,
      skillId: s.skillId,
      label: s.label ?? null,
      abilityOverride: s.abilityOverride ?? null,
      ranks: s.ranks,
      miscMod: s.miscMod,
    }))
  );
}

export async function deleteCharacterSkill(id: string): Promise<void> {
  await db.delete(characterSkills).where(eq(characterSkills.id, id));
}

export async function deleteCharacterSkillsBySkillId(
  characterId: string,
  skillId: string
): Promise<void> {
  await db
    .delete(characterSkills)
    .where(and(eq(characterSkills.characterId, characterId), eq(characterSkills.skillId, skillId)));
}

export async function updateCharacterSkillRanks(id: string, ranks: number): Promise<void> {
  await db.update(characterSkills).set({ ranks }).where(eq(characterSkills.id, id));
}

export async function updateCharacterSkillMiscMod(id: string, miscMod: number): Promise<void> {
  await db.update(characterSkills).set({ miscMod }).where(eq(characterSkills.id, id));
}

export async function upsertCharacterDescriptionValue(
  characterId: string,
  descriptionId: string,
  value: string
): Promise<void> {
  await db
    .insert(characterDescriptions)
    .values({ characterId, descriptionId, value })
    .onConflictDoUpdate({
      target: [characterDescriptions.characterId, characterDescriptions.descriptionId],
      set: { value },
    });
}

export type CharacterEquipmentEntry = {
  id: string;
  equipmentId: string;
  quantity: number;
  currentCharges: number | null;
  equipment: Equipment;
};

export async function getCharacterEquipment(characterId: string): Promise<CharacterEquipmentEntry[]> {
  const rows = await db
    .select({ id: characterEquipment.id, equipmentId: characterEquipment.equipmentId, quantity: characterEquipment.quantity, currentCharges: characterEquipment.currentCharges, equipment })
    .from(characterEquipment)
    .innerJoin(equipment, eq(equipment.id, characterEquipment.equipmentId))
    .where(eq(characterEquipment.characterId, characterId))
    .orderBy(asc(equipment.category), asc(equipment.itemLevel));
  return rows;
}

export async function addCharacterEquipment(characterId: string, equipmentId: string): Promise<CharacterEquipmentEntry> {
  const [row] = await db
    .insert(characterEquipment)
    .values({ characterId, equipmentId, quantity: 1 })
    .returning();
  const [entry] = await db
    .select({ id: characterEquipment.id, equipmentId: characterEquipment.equipmentId, quantity: characterEquipment.quantity, currentCharges: characterEquipment.currentCharges, equipment })
    .from(characterEquipment)
    .innerJoin(equipment, eq(equipment.id, characterEquipment.equipmentId))
    .where(eq(characterEquipment.id, row.id));
  return entry;
}

export async function removeCharacterEquipment(characterEquipmentId: string): Promise<void> {
  await db.delete(characterEquipment).where(eq(characterEquipment.id, characterEquipmentId));
}

export async function updateCharacterEquipmentQuantity(characterEquipmentId: string, quantity: number): Promise<void> {
  await db.update(characterEquipment).set({ quantity }).where(eq(characterEquipment.id, characterEquipmentId));
}

export async function updateCharacterEquipmentCharges(characterEquipmentId: string, currentCharges: number | null): Promise<void> {
  await db.update(characterEquipment).set({ currentCharges }).where(eq(characterEquipment.id, characterEquipmentId));
}

export async function addCharacterWeapon(characterId: string, weaponId: string): Promise<void> {
  await db.insert(characterWeapons).values({ characterId, weaponId }).onConflictDoNothing();
}

export async function removeCharacterWeapon(characterId: string, weaponId: string): Promise<void> {
  await db
    .delete(characterWeapons)
    .where(and(eq(characterWeapons.characterId, characterId), eq(characterWeapons.weaponId, weaponId)));
}

export async function getCharacterClassChoices(characterId: string): Promise<CharacterClassChoice[]> {
  return db
    .select()
    .from(characterClassChoices)
    .where(eq(characterClassChoices.characterId, characterId))
    .orderBy(asc(characterClassChoices.acquiredAtLevel));
}

export async function upsertCharacterClassChoice(data: NewCharacterClassChoice): Promise<void> {
  await db
    .insert(characterClassChoices)
    .values(data)
    .onConflictDoUpdate({
      target: [characterClassChoices.characterId, characterClassChoices.classAbilityId, characterClassChoices.acquiredAtLevel],
      set: { optionId: data.optionId, customValue: data.customValue },
    });
}

export type CharacterFeatWithName = {
  id: string;
  characterId: string;
  featId: string | null;
  customName: string | null;
  notes: string | null;
  name: string;
  description: string | null;
  prerequisites: string | null;
  isCombatFeat: boolean;
};

export async function getCharacterFeats(characterId: string): Promise<CharacterFeatWithName[]> {
  const rows = await db
    .select({
      id: characterFeats.id,
      characterId: characterFeats.characterId,
      featId: characterFeats.featId,
      customName: characterFeats.customName,
      notes: characterFeats.notes,
      name: feats.name,
      description: feats.description,
      prerequisites: feats.prerequisites,
      isCombatFeat: feats.isCombatFeat,
    })
    .from(characterFeats)
    .leftJoin(feats, eq(characterFeats.featId, feats.id))
    .where(eq(characterFeats.characterId, characterId))
    .orderBy(asc(feats.name));

  return rows.map((r) => ({
    ...r,
    name: r.name ?? r.customName ?? "",
    description: r.description ?? null,
    prerequisites: r.prerequisites ?? null,
    isCombatFeat: r.isCombatFeat ?? false,
  }));
}

export async function addCharacterFeat(data: NewCharacterFeat): Promise<void> {
  await db.insert(characterFeats).values(data);
}

export async function removeCharacterFeat(id: string, characterId: string): Promise<void> {
  await db
    .delete(characterFeats)
    .where(and(eq(characterFeats.id, id), eq(characterFeats.characterId, characterId)));
}

export type CharacterMiscFields = {
  credits: number;
  xpEarned: number;
  languages: string[];
};

export async function getCharacterMiscFields(characterId: string): Promise<CharacterMiscFields | null> {
  const [row] = await db
    .select({ credits: characters.credits, xpEarned: characters.xpEarned, languages: characters.languages })
    .from(characters)
    .where(eq(characters.id, characterId))
    .limit(1);
  return row ?? null;
}

export async function updateCharacterCredits(characterId: string, credits: number): Promise<void> {
  await db.update(characters).set({ credits }).where(eq(characters.id, characterId));
}

export async function updateCharacterXpEarned(characterId: string, xpEarned: number): Promise<void> {
  await db.update(characters).set({ xpEarned }).where(eq(characters.id, characterId));
}

export async function addCharacterLanguage(characterId: string, language: string): Promise<void> {
  const row = await getCharacterMiscFields(characterId);
  if (!row) return;
  const updated = [...row.languages, language];
  await db.update(characters).set({ languages: updated }).where(eq(characters.id, characterId));
}

export async function removeCharacterLanguage(characterId: string, language: string): Promise<void> {
  const row = await getCharacterMiscFields(characterId);
  if (!row) return;
  const updated = row.languages.filter((l) => l !== language);
  await db.update(characters).set({ languages: updated }).where(eq(characters.id, characterId));
}
