import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  races,
  classes,
  themes,
  raceAttributes,
  classAttributes,
  themeAttributes,
  type Race,
  type Class,
  type Theme,
  type RaceAttribute,
  type ClassAttribute,
  type ThemeAttribute,
} from "@/db/schema";

export async function getRaces(): Promise<Race[]> {
  return db.select().from(races);
}

export async function getClasses(): Promise<Class[]> {
  return db.select().from(classes);
}

export async function getThemes(): Promise<Theme[]> {
  return db.select().from(themes);
}

export async function getRaceAttributes(raceId: string): Promise<RaceAttribute[]> {
  return db
    .select()
    .from(raceAttributes)
    .where(eq(raceAttributes.raceId, raceId))
    .orderBy(asc(raceAttributes.sortOrder));
}

export async function getClassAttributes(classId: string): Promise<ClassAttribute[]> {
  return db
    .select()
    .from(classAttributes)
    .where(eq(classAttributes.classId, classId))
    .orderBy(asc(classAttributes.sortOrder));
}

export async function getThemeAttributes(themeId: string): Promise<ThemeAttribute[]> {
  return db
    .select()
    .from(themeAttributes)
    .where(eq(themeAttributes.themeId, themeId))
    .orderBy(asc(themeAttributes.sortOrder));
}
