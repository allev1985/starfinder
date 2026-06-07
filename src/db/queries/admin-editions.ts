"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { editions, type Edition } from "@/db/schema";

export async function listEditions(): Promise<Edition[]> {
  return db.select().from(editions).orderBy(editions.name);
}

export async function createEdition(name: string, slug: string): Promise<{ error?: string }> {
  try {
    await db.insert(editions).values({ name, slug });
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { error: "A edition with that slug already exists." };
    }
    return { error: "Failed to create edition." };
  }
}
