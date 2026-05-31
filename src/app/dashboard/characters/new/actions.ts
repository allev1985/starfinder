"use server";

import { getUser } from "@/lib/session";
import { createCharacterForUser } from "@/services/characters";
import { getRaceById } from "@/db/queries/reference";

type Result =
  | { success: true; characterId: string }
  | { success: false; error: string };

export async function createCharacterAction(formData: FormData): Promise<Result> {
  const name = formData.get("name");
  const raceId = formData.get("raceId");
  const classId = formData.get("classId");
  const themeId = formData.get("themeId");
  const chassisIdRaw = formData.get("chassisId");
  const chassisId = typeof chassisIdRaw === "string" && chassisIdRaw.trim().length > 0 ? chassisIdRaw.trim() : null;

  if (typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Character name is required." };
  }
  if (typeof raceId !== "string" || raceId.trim().length === 0) {
    return { success: false, error: "Race is required." };
  }
  if (typeof classId !== "string" || classId.trim().length === 0) {
    return { success: false, error: "Class is required." };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const race = await getRaceById(raceId.trim());
  const isDrone = race?.type === "drone";

  const resolvedThemeId = typeof themeId === "string" && themeId.trim().length > 0
    ? themeId.trim()
    : null;

  if (!isDrone && !resolvedThemeId) {
    return { success: false, error: "Theme is required." };
  }

  try {
    const character = await createCharacterForUser({
      name: name.trim(),
      ownerId: user.id,
      raceId: raceId.trim(),
      classId: classId.trim(),
      themeId: resolvedThemeId,
      chassisId,
    });
    return { success: true, characterId: character.id };
  } catch {
    return { success: false, error: "Failed to create character. Please try again." };
  }
}
