"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { feats, type Feat } from "@/db/schema";

export interface FeatFormData {
  name: string;
  description: string;
  prerequisites?: string | null;
  isCombatFeat: boolean;
  isShieldProficiency: boolean;
  sourceBook: string;
}

export async function listFeats(editionId: string): Promise<Feat[]> {
  return db.select().from(feats).where(eq(feats.editionId, editionId)).orderBy(feats.name);
}

export async function createFeat(editionId: string, data: FeatFormData): Promise<{ data?: Feat; error?: string }> {
  try {
    const [created] = await db.insert(feats).values({ editionId, ...data }).returning();
    revalidatePath("/dashboard/admin/data");
    return { data: created };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("unique") || msg.includes("duplicate")) return { error: "A feat with that name already exists." };
    return { error: "Failed to create feat." };
  }
}

export async function updateFeat(id: string, data: FeatFormData): Promise<{ error?: string }> {
  try {
    await db.update(feats).set(data).where(eq(feats.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("unique") || msg.includes("duplicate")) return { error: "A feat with that name already exists." };
    return { error: "Failed to update feat." };
  }
}

export async function deleteFeat(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(feats).where(eq(feats.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to delete feat." };
  }
}
