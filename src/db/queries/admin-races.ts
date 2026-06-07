"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { races, type Race, type RaceType } from "@/db/schema";

export async function listRaces(editionId: string): Promise<Race[]> {
  return db.select().from(races).where(eq(races.editionId, editionId)).orderBy(races.name);
}

export async function createRace(editionId: string, name: string, type: RaceType): Promise<{ data?: Race; error?: string }> {
  try {
    const [created] = await db.insert(races).values({ editionId, name, type }).returning();
    revalidatePath("/dashboard/admin/data");
    return { data: created };
  } catch {
    return { error: "Failed to create race." };
  }
}

export async function updateRace(id: string, name: string, type: RaceType): Promise<{ error?: string }> {
  try {
    await db.update(races).set({ name, type }).where(eq(races.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update race." };
  }
}

export async function deleteRace(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(races).where(eq(races.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("foreign key") || msg.includes("violates")) {
      return { error: "This race is referenced by one or more characters and cannot be deleted." };
    }
    return { error: "Failed to delete race." };
  }
}
