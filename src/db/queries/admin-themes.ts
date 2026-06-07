"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { themes, themeAbilities, type Theme, type ThemeAbility } from "@/db/schema";

export async function listThemes(editionId: string): Promise<Theme[]> {
  return db.select().from(themes).where(eq(themes.editionId, editionId)).orderBy(themes.name);
}

export async function createTheme(editionId: string, name: string): Promise<{ error?: string }> {
  try {
    await db.insert(themes).values({ editionId, name });
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to create theme." };
  }
}

export async function updateTheme(id: string, name: string): Promise<{ error?: string }> {
  try {
    await db.update(themes).set({ name }).where(eq(themes.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update theme." };
  }
}

export async function deleteTheme(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(themes).where(eq(themes.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("foreign key") || msg.includes("violates")) {
      return { error: "This theme is referenced by characters and cannot be deleted." };
    }
    return { error: "Failed to delete theme." };
  }
}

export async function listThemeAbilities(themeId: string): Promise<ThemeAbility[]> {
  return db.select().from(themeAbilities).where(eq(themeAbilities.themeId, themeId)).orderBy(themeAbilities.level, themeAbilities.name);
}

export async function createThemeAbility(
  themeId: string,
  editionId: string,
  data: { name: string; description: string; level: number }
): Promise<{ error?: string }> {
  try {
    await db.insert(themeAbilities).values({ themeId, editionId, ...data });
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to create theme ability." };
  }
}

export async function updateThemeAbility(
  id: string,
  data: { name: string; description: string; level: number }
): Promise<{ error?: string }> {
  try {
    await db.update(themeAbilities).set(data).where(eq(themeAbilities.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update theme ability." };
  }
}

export async function deleteThemeAbility(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(themeAbilities).where(eq(themeAbilities.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to delete theme ability." };
  }
}
