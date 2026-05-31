import { db } from "@/db";
import { weapons, characterWeapons } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Weapon } from "@/db/schema";

export async function getAllWeapons(): Promise<Weapon[]> {
  return db.select().from(weapons).orderBy(weapons.category, weapons.itemLevel, weapons.name);
}

export async function getCharacterWeapons(characterId: string): Promise<Weapon[]> {
  const rows = await db
    .select({ weapon: weapons })
    .from(characterWeapons)
    .innerJoin(weapons, eq(characterWeapons.weaponId, weapons.id))
    .where(eq(characterWeapons.characterId, characterId))
    .orderBy(weapons.category, weapons.itemLevel, weapons.name);

  return rows.map((r) => r.weapon);
}
