"use server";

import { getUser } from "@/lib/session";
import { createCharacterForUser } from "@/services/characters";

type Result =
  | { success: true; characterId: string }
  | { success: false; error: string };

export async function createCharacterAction(formData: FormData): Promise<Result> {
  const name = formData.get("name");
  const raceId = formData.get("raceId");
  const classId = formData.get("classId");
  const themeId = formData.get("themeId");

  if (typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Character name is required." };
  }
  if (typeof raceId !== "string" || raceId.trim().length === 0) {
    return { success: false, error: "Race is required." };
  }
  if (typeof classId !== "string" || classId.trim().length === 0) {
    return { success: false, error: "Class is required." };
  }
  if (typeof themeId !== "string" || themeId.trim().length === 0) {
    return { success: false, error: "Theme is required." };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    const character = await createCharacterForUser({
      name: name.trim(),
      ownerId: user.id,
      raceId: raceId.trim(),
      classId: classId.trim(),
      themeId: themeId.trim(),
    });
    return { success: true, characterId: character.id };
  } catch {
    return { success: false, error: "Failed to create character. Please try again." };
  }
}
