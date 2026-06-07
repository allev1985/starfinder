"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { conditions, type Condition } from "@/db/schema";

export interface ConditionFormData {
  name: string;
  slug: string;
  description: string;
}

export async function listConditions(editionId: string): Promise<Condition[]> {
  return db.select().from(conditions).where(eq(conditions.editionId, editionId)).orderBy(conditions.name);
}

export async function createCondition(editionId: string, data: ConditionFormData): Promise<{ data?: Condition; error?: string }> {
  try {
    const [created] = await db.insert(conditions).values({ editionId, ...data }).returning();
    revalidatePath("/dashboard/admin/data");
    return { data: created };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("unique") || msg.includes("duplicate")) return { error: "A condition with that slug already exists for this edition." };
    return { error: "Failed to create condition." };
  }
}

export async function updateCondition(id: string, data: ConditionFormData): Promise<{ error?: string }> {
  try {
    await db.update(conditions).set(data).where(eq(conditions.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("unique") || msg.includes("duplicate")) return { error: "A condition with that slug already exists for this edition." };
    return { error: "Failed to update condition." };
  }
}

export async function deleteCondition(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(conditions).where(eq(conditions.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to delete condition." };
  }
}
