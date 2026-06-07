"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { skills, type Skill } from "@/db/schema";

export async function listSkillsByEdition(editionId: string): Promise<Skill[]> {
  return db.select().from(skills).where(eq(skills.editionId, editionId)).orderBy(skills.name);
}

export async function createSkill(
  editionId: string,
  data: { name: string; ability: string; abilityAlts?: string[] | null; trainedOnly: boolean; armorCheckPenalty: boolean }
): Promise<{ data?: Skill; error?: string }> {
  try {
    const [created] = await db.insert(skills).values({
      id: crypto.randomUUID(),
      editionId,
      name: data.name,
      ability: data.ability,
      abilityAlts: data.abilityAlts ?? null,
      trainedOnly: data.trainedOnly,
      armorCheckPenalty: data.armorCheckPenalty,
    }).returning();
    revalidatePath("/dashboard/admin/data");
    return { data: created };
  } catch {
    return { error: "Failed to create skill." };
  }
}

export async function updateSkill(
  id: string,
  data: { name: string; ability: string; abilityAlts?: string[] | null; trainedOnly: boolean; armorCheckPenalty: boolean }
): Promise<{ error?: string }> {
  try {
    await db.update(skills).set({
      name: data.name,
      ability: data.ability,
      abilityAlts: data.abilityAlts ?? null,
      trainedOnly: data.trainedOnly,
      armorCheckPenalty: data.armorCheckPenalty,
    }).where(eq(skills.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update skill." };
  }
}

export async function deleteSkill(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(skills).where(eq(skills.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("foreign key") || msg.includes("violates")) {
      return { error: "This skill is referenced by classes or characters and cannot be deleted." };
    }
    return { error: "Failed to delete skill." };
  }
}
