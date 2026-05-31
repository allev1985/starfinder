"use server";

import { getUser } from "@/lib/session";
import { updateCharacterForOwner, NotOwnerError } from "@/services/characters";
import { getRaceById } from "@/db/queries/reference";

type Result = { success: true } | { success: false; error: string };

export async function updateCharacterAction(
  characterId: string,
  formData: FormData
): Promise<Result> {
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
  if (isDrone && !chassisId) {
    return { success: false, error: "Chassis is required." };
  }

  try {
    await updateCharacterForOwner(characterId, user.id, {
      name: name.trim(),
      raceId: raceId.trim(),
      classId: classId.trim(),
      themeId: resolvedThemeId,
      chassisId,
    });
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to update character." };
  }
}
