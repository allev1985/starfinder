"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { armor, type Armor, type ArmorType } from "@/db/schema";

export interface ArmorFormData {
  name: string;
  type: ArmorType;
  itemLevel: number;
  price: number;
  eacBonus: number;
  kacBonus: number;
  maxDexBonus?: number | null;
  armorCheckPenalty: number;
  speedAdjustment: number;
  bulk: string;
  upgradeSlots: number;
  sourceBook: string;
  dr?: string | null;
  resistances?: string | null;
}

export async function listArmor(editionId: string): Promise<Armor[]> {
  return db.select().from(armor).where(eq(armor.editionId, editionId)).orderBy(armor.type, armor.itemLevel);
}

export async function createArmor(editionId: string, data: ArmorFormData): Promise<{ data?: Armor; error?: string }> {
  try {
    const [created] = await db.insert(armor).values({ editionId, ...data }).returning();
    revalidatePath("/dashboard/admin/data");
    return { data: created };
  } catch {
    return { error: "Failed to create armor." };
  }
}

export async function updateArmor(id: string, data: ArmorFormData): Promise<{ error?: string }> {
  try {
    await db.update(armor).set(data).where(eq(armor.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update armor." };
  }
}

export async function deleteArmor(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(armor).where(eq(armor.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to delete armor." };
  }
}
