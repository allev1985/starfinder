"use server";

import { getUser } from "@/lib/session";
import { updateCharacterForOwner, NotOwnerError } from "@/services/characters";

type Result = { success: true } | { success: false; error: string };

export async function updateCharacterAction(
  characterId: string,
  formData: FormData
): Promise<Result> {
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Character name is required." };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await updateCharacterForOwner(characterId, user.id, { name: name.trim() });
    return { success: true };
  } catch (err) {
    if (err instanceof NotOwnerError) return { success: false, error: "Not authorised." };
    return { success: false, error: "Failed to update character." };
  }
}
