"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  classes,
  classSkills,
  classAbilities,
  classArmorProficiency,
  classWeaponProficiency,
  type Class,
  type ClassAbility,
  type ArmorType,
  type WeaponCategory,
} from "@/db/schema";

export async function listClasses(editionId: string): Promise<Class[]> {
  return db.select().from(classes).where(eq(classes.editionId, editionId)).orderBy(classes.name);
}

export async function createClass(
  editionId: string,
  data: { name: string; skillRanksPerLevel: number; isSpellcaster: boolean }
): Promise<{ error?: string }> {
  try {
    await db.insert(classes).values({ editionId, ...data });
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to create class." };
  }
}

export async function updateClass(
  id: string,
  data: { name: string; skillRanksPerLevel: number; isSpellcaster: boolean }
): Promise<{ error?: string }> {
  try {
    await db.update(classes).set(data).where(eq(classes.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update class." };
  }
}

export async function deleteClass(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(classes).where(eq(classes.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("foreign key") || msg.includes("violates")) {
      return { error: "This class is referenced by characters and cannot be deleted." };
    }
    return { error: "Failed to delete class." };
  }
}

// Class Skills junction
export async function listClassSkillIds(classId: string): Promise<string[]> {
  const rows = await db.select({ skillId: classSkills.skillId }).from(classSkills).where(eq(classSkills.classId, classId));
  return rows.map((r) => r.skillId);
}

export async function setClassSkill(classId: string, skillId: string, enabled: boolean): Promise<{ error?: string }> {
  try {
    if (enabled) {
      await db.insert(classSkills).values({ classId, skillId }).onConflictDoNothing();
    } else {
      await db.delete(classSkills).where(and(eq(classSkills.classId, classId), eq(classSkills.skillId, skillId)));
    }
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update class skill." };
  }
}

// Class Abilities
export async function listClassAbilities(classId: string): Promise<ClassAbility[]> {
  return db.select().from(classAbilities).where(eq(classAbilities.classId, classId)).orderBy(classAbilities.level, classAbilities.name);
}

export async function createClassAbility(
  classId: string,
  editionId: string,
  data: { name: string; description: string; level: number; repeatable: boolean; choicePool?: string | null }
): Promise<{ error?: string }> {
  try {
    await db.insert(classAbilities).values({ classId, editionId, ...data });
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to create class ability." };
  }
}

export async function updateClassAbility(
  id: string,
  data: { name: string; description: string; level: number; repeatable: boolean; choicePool?: string | null }
): Promise<{ error?: string }> {
  try {
    await db.update(classAbilities).set(data).where(eq(classAbilities.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update class ability." };
  }
}

export async function deleteClassAbility(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(classAbilities).where(eq(classAbilities.id, id));
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to delete class ability." };
  }
}

// Proficiencies
export async function listClassArmorProficiencies(classId: string): Promise<ArmorType[]> {
  const rows = await db.select({ armorType: classArmorProficiency.armorType }).from(classArmorProficiency).where(eq(classArmorProficiency.classId, classId));
  return rows.map((r) => r.armorType);
}

export async function setClassArmorProficiency(classId: string, armorType: ArmorType, enabled: boolean): Promise<{ error?: string }> {
  try {
    if (enabled) {
      await db.insert(classArmorProficiency).values({ classId, armorType }).onConflictDoNothing();
    } else {
      await db.delete(classArmorProficiency).where(and(eq(classArmorProficiency.classId, classId), eq(classArmorProficiency.armorType, armorType)));
    }
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update armor proficiency." };
  }
}

export async function listClassWeaponProficiencies(classId: string): Promise<WeaponCategory[]> {
  const rows = await db.select({ weaponCategory: classWeaponProficiency.weaponCategory }).from(classWeaponProficiency).where(eq(classWeaponProficiency.classId, classId));
  return rows.map((r) => r.weaponCategory);
}

export async function setClassWeaponProficiency(classId: string, weaponCategory: WeaponCategory, enabled: boolean): Promise<{ error?: string }> {
  try {
    if (enabled) {
      await db.insert(classWeaponProficiency).values({ classId, weaponCategory }).onConflictDoNothing();
    } else {
      await db.delete(classWeaponProficiency).where(and(eq(classWeaponProficiency.classId, classId), eq(classWeaponProficiency.weaponCategory, weaponCategory)));
    }
    revalidatePath("/dashboard/admin/data");
    return {};
  } catch {
    return { error: "Failed to update weapon proficiency." };
  }
}
