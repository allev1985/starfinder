"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { chassis, characters, type Chassis } from "@/db/schema";

export interface ChassisFormData {
  name: string;
  bonusSkillId?: string | null;
  defaultStr: number;
  defaultDex: number;
  defaultInt: number;
  defaultWis: number;
  defaultCha: number;
}

export async function listChassis(editionId: string): Promise<Chassis[]> {
  return db.select().from(chassis).where(eq(chassis.editionId, editionId)).orderBy(chassis.name);
}

export async function createChassis(editionId: string, data: ChassisFormData): Promise<{ error?: string }> {
  try {
    await db.insert(chassis).values({ editionId, ...data });
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to create chassis." };
  }
}

export async function updateChassis(id: string, data: ChassisFormData): Promise<{ error?: string }> {
  try {
    await db.update(chassis).set(data).where(eq(chassis.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update chassis." };
  }
}

export async function deleteChassis(id: string): Promise<{ error?: string }> {
  const [ref] = await db.select({ id: characters.id }).from(characters).where(eq(characters.chassisId, id)).limit(1);
  if (ref) return { error: "This chassis is used by one or more characters and cannot be deleted." };
  try {
    await db.delete(chassis).where(eq(chassis.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to delete chassis." };
  }
}
