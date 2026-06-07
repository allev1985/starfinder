"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { weapons, type Weapon, type WeaponCategory } from "@/db/schema";

export interface WeaponFormData {
  name: string;
  category: WeaponCategory;
  itemLevel: number;
  damageDice: string;
  damageTypes: string[];
  criticalEffect?: string | null;
  criticalDice?: string | null;
  range?: string | null;
  capacity?: number | null;
  usage?: number | null;
  bulk: string;
  special?: string | null;
  ammoType?: string | null;
  sourceBook: string;
}

export async function listWeapons(editionId: string): Promise<Weapon[]> {
  return db.select().from(weapons).where(eq(weapons.editionId, editionId)).orderBy(weapons.category, weapons.itemLevel);
}

export async function createWeapon(editionId: string, data: WeaponFormData): Promise<{ error?: string }> {
  try {
    await db.insert(weapons).values({ editionId, ...data });
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to create weapon." };
  }
}

export async function updateWeapon(id: string, data: WeaponFormData): Promise<{ error?: string }> {
  try {
    await db.update(weapons).set(data).where(eq(weapons.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update weapon." };
  }
}

export async function deleteWeapon(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(weapons).where(eq(weapons.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to delete weapon." };
  }
}
