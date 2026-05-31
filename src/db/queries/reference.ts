import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  races,
  classes,
  themes,
  raceDescriptions,
  skills,
  classSkills,
  type Race,
  type Class,
  type Theme,
  type RaceDescription,
  type RaceType,
  type Skill,
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

export async function getDescriptionsForType(raceType: RaceType): Promise<RaceDescription[]> {
  return db
    .select()
    .from(raceDescriptions)
    .where(eq(raceDescriptions.raceType, raceType))
    .orderBy(asc(raceDescriptions.sortOrder));
}
