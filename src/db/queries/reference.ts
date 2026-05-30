import "server-only";
import { db } from "@/db";
import { races, classes, themes, type Race, type Class, type Theme } from "@/db/schema";

export async function getRaces(): Promise<Race[]> {
  return db.select().from(races);
}

export async function getClasses(): Promise<Class[]> {
  return db.select().from(classes);
}

export async function getThemes(): Promise<Theme[]> {
  return db.select().from(themes);
}
