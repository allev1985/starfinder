import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  spells,
  spellClass,
  characterSpells,
  classSpellProgression,
  type Spell,
  type CharacterSpell,
} from "@/db/schema";

export async function getSpellsByClassAndLevel(
  classId: string,
  spellLevel: number
): Promise<Spell[]> {
  return db
    .select({ spell: spells })
    .from(spells)
    .innerJoin(spellClass, eq(spellClass.spellId, spells.id))
    .where(and(eq(spellClass.classId, classId), eq(spellClass.spellLevel, spellLevel)))
    .then((rows) => rows.map((r) => r.spell));
}

export async function getCharacterSpells(
  characterId: string
): Promise<(CharacterSpell & { spell: Spell })[]> {
  return db
    .select({ characterSpell: characterSpells, spell: spells })
    .from(characterSpells)
    .innerJoin(spells, eq(characterSpells.spellId, spells.id))
    .where(eq(characterSpells.characterId, characterId))
    .then((rows) =>
      rows.map((r) => ({ ...r.characterSpell, spell: r.spell }))
    );
}

export async function addCharacterSpell(
  characterId: string,
  spellId: string,
  spellLevel: number
): Promise<CharacterSpell> {
  const [row] = await db
    .insert(characterSpells)
    .values({ characterId, spellId, spellLevel })
    .returning();
  return row;
}

export async function removeCharacterSpell(
  characterId: string,
  spellId: string
): Promise<void> {
  await db
    .delete(characterSpells)
    .where(
      and(
        eq(characterSpells.characterId, characterId),
        eq(characterSpells.spellId, spellId)
      )
    );
}

export async function getSpellsKnownLimits(
  classId: string,
  characterLevel: number
): Promise<Record<number, number>> {
  const rows = await db
    .select()
    .from(classSpellProgression)
    .where(
      and(
        eq(classSpellProgression.classId, classId),
        eq(classSpellProgression.characterLevel, characterLevel)
      )
    );
  return Object.fromEntries(rows.map((r) => [r.spellLevel, r.spellsKnown]));
}
