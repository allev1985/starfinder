"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { spells, spellClass, classes, type Spell, type SpellSchool } from "@/db/schema";

export interface SpellFormData {
  name: string;
  school: SpellSchool;
  castingTime: string;
  range: string;
  duration: string;
  description: string;
  area?: string | null;
  targets?: string | null;
  savingThrow?: string | null;
  spellResist?: string | null;
  damage?: string | null;
  damageNote?: string | null;
  source: string;
}

export interface SpellClassAssignment {
  classId: string;
  className: string;
  spellLevel: number | null;
}

export async function listSpells(editionId: string): Promise<Spell[]> {
  return db.select().from(spells).where(eq(spells.editionId, editionId)).orderBy(spells.name);
}

export async function createSpell(editionId: string, data: SpellFormData): Promise<{ data?: Spell; error?: string }> {
  try {
    const [created] = await db.insert(spells).values({ editionId, ...data }).returning();
    revalidatePath("/dashboard/admin/data");
    return { data: created };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("unique") || msg.includes("duplicate")) return { error: "A spell with that name already exists." };
    return { error: "Failed to create spell." };
  }
}

export async function updateSpell(id: string, data: SpellFormData): Promise<{ error?: string }> {
  try {
    await db.update(spells).set(data).where(eq(spells.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update spell." };
  }
}

export async function deleteSpell(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(spells).where(eq(spells.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to delete spell." };
  }
}

export async function listSpellClassAssignments(spellId: string, editionId: string): Promise<SpellClassAssignment[]> {
  const allClasses = await db.select().from(classes).where(eq(classes.editionId, editionId)).orderBy(classes.name);
  const assignments = await db.select().from(spellClass).where(eq(spellClass.spellId, spellId));
  const assignMap = new Map(assignments.map((a) => [a.classId, a.spellLevel]));
  return allClasses.map((c) => ({ classId: c.id, className: c.name, spellLevel: assignMap.get(c.id) ?? null }));
}

export async function setSpellClass(spellId: string, classId: string, spellLevel: number | null): Promise<{ error?: string }> {
  try {
    if (spellLevel !== null) {
      await db.insert(spellClass).values({ spellId, classId, spellLevel }).onConflictDoUpdate({ target: [spellClass.spellId, spellClass.classId], set: { spellLevel } });
    } else {
      await db.delete(spellClass).where(and(eq(spellClass.spellId, spellId), eq(spellClass.classId, classId)));
    }
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update spell class assignment." };
  }
}
