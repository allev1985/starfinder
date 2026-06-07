"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { equipment, type Equipment, type EquipmentCategory, type AugmentationSystem } from "@/db/schema";

export interface EquipmentFormData {
  name: string;
  category: EquipmentCategory;
  itemLevel: number;
  price: number;
  bulk: string;
  system?: AugmentationSystem | null;
  ammoType?: string | null;
  ammoCapacity?: number | null;
  bonusHint?: string | null;
}

export async function listEquipment(): Promise<Equipment[]> {
  return db.select().from(equipment).orderBy(equipment.category, equipment.itemLevel);
}

export async function createEquipment(data: EquipmentFormData): Promise<{ data?: Equipment; error?: string }> {
  try {
    const [created] = await db.insert(equipment).values({ ...data }).returning();
    revalidatePath("/dashboard/admin/data");
    return { data: created };
  } catch {
    return { error: "Failed to create equipment." };
  }
}

export async function updateEquipment(id: string, data: EquipmentFormData): Promise<{ error?: string }> {
  try {
    await db.update(equipment).set(data).where(eq(equipment.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update equipment." };
  }
}

export async function deleteEquipment(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(equipment).where(eq(equipment.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to delete equipment." };
  }
}
