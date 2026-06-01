import "server-only";
import { and, asc, eq, ilike, inArray } from "drizzle-orm";
import { DRONE_SKILL_NAMES } from "@/lib/drone";
import { db } from "@/db";
import {
  races,
  classes,
  themes,
  raceDescriptions,
  skills,
  classSkills,
  chassis,
  armor,
  classArmorProficiency,
  classWeaponProficiency,
  classAbilities,
  classAbilityOptions,
  themeAbilities,
  feats,
  equipment,
  type Race,
  type Class,
  type Theme,
  type RaceDescription,
  type RaceType,
  type Skill,
  type Chassis,
  type Armor,
  type Equipment,
  type ClassAbility,
  type ClassAbilityOption,
  type ThemeAbility,
  type Feat,
  type WeaponCategory,
} from "@/db/schema";

export type SkillWithClassFlag = Skill & { isClassSkill: boolean };

export async function getAllSkillsWithClassFlag(classId: string | null): Promise<SkillWithClassFlag[]> {
  const allSkills = await db.select().from(skills).orderBy(asc(skills.name));
  if (!classId) return allSkills.map((s) => ({ ...s, isClassSkill: false }));
  const classSkillRows = await db
    .select({ skillId: classSkills.skillId })
    .from(classSkills)
    .where(eq(classSkills.classId, classId));
  const classSkillIds = new Set(classSkillRows.map((r) => r.skillId));
  return allSkills.map((s) => ({ ...s, isClassSkill: classSkillIds.has(s.id) }));
}

export async function getRaces(): Promise<Race[]> {
  return db.select().from(races);
}

export async function getRaceById(id: string): Promise<Race | null> {
  const [race] = await db.select().from(races).where(eq(races.id, id)).limit(1);
  return race ?? null;
}

export async function getClasses(): Promise<Class[]> {
  return db.select().from(classes);
}

export async function getThemes(): Promise<Theme[]> {
  return db.select().from(themes);
}

export async function getAllChassis(): Promise<Chassis[]> {
  return db.select().from(chassis).orderBy(asc(chassis.name));
}

export async function getChassisById(id: string): Promise<Chassis | null> {
  const [row] = await db.select().from(chassis).where(eq(chassis.id, id)).limit(1);
  return row ?? null;
}

export async function getDroneSkills(): Promise<Skill[]> {
  return db
    .select()
    .from(skills)
    .where(inArray(skills.name, DRONE_SKILL_NAMES))
    .orderBy(asc(skills.name));
}

export async function getArmorForClass(classId: string | null): Promise<Armor[]> {
  if (!classId) return [];
  const proficiencies = await db
    .select({ armorType: classArmorProficiency.armorType })
    .from(classArmorProficiency)
    .where(eq(classArmorProficiency.classId, classId));
  if (proficiencies.length === 0) return [];
  const types = proficiencies.map((p) => p.armorType);
  return db
    .select()
    .from(armor)
    .where(inArray(armor.type, types))
    .orderBy(asc(armor.type), asc(armor.itemLevel));
}

export async function getArmorById(id: string): Promise<Armor | null> {
  const [row] = await db.select().from(armor).where(eq(armor.id, id)).limit(1);
  return row ?? null;
}

export async function getAllEquipment(): Promise<Equipment[]> {
  return db.select().from(equipment).orderBy(asc(equipment.category), asc(equipment.itemLevel), asc(equipment.name));
}

export async function getDescriptionsForType(raceType: RaceType): Promise<RaceDescription[]> {
  return db
    .select()
    .from(raceDescriptions)
    .where(eq(raceDescriptions.raceType, raceType))
    .orderBy(asc(raceDescriptions.sortOrder));
}

export async function getClassAbilities(classId: string): Promise<ClassAbility[]> {
  return db
    .select()
    .from(classAbilities)
    .where(eq(classAbilities.classId, classId))
    .orderBy(asc(classAbilities.level), asc(classAbilities.name));
}

export async function getClassAbilityOptions(classId: string, poolName: string): Promise<ClassAbilityOption[]> {
  return db
    .select()
    .from(classAbilityOptions)
    .where(and(eq(classAbilityOptions.classId, classId), eq(classAbilityOptions.poolName, poolName)))
    .orderBy(asc(classAbilityOptions.name));
}

export async function getAllClassAbilityOptions(classId: string): Promise<ClassAbilityOption[]> {
  return db
    .select()
    .from(classAbilityOptions)
    .where(eq(classAbilityOptions.classId, classId))
    .orderBy(asc(classAbilityOptions.poolName), asc(classAbilityOptions.name));
}

export async function getThemeAbilities(themeId: string): Promise<ThemeAbility[]> {
  return db
    .select()
    .from(themeAbilities)
    .where(eq(themeAbilities.themeId, themeId))
    .orderBy(asc(themeAbilities.level));
}

export async function searchFeats(query: string): Promise<Feat[]> {
  const rows = await db
    .select()
    .from(feats)
    .where(query.trim() ? ilike(feats.name, `%${query.trim()}%`) : undefined)
    .orderBy(asc(feats.name))
    .limit(20);
  return rows;
}

export async function getWeaponProficienciesForClass(classId: string): Promise<WeaponCategory[]> {
  const rows = await db
    .select({ weaponCategory: classWeaponProficiency.weaponCategory })
    .from(classWeaponProficiency)
    .where(eq(classWeaponProficiency.classId, classId));
  return rows.map((r) => r.weaponCategory);
}

export { type ClassAbility, type ClassAbilityOption, type ThemeAbility, type Feat };
