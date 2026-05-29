"use server";

import { getUser } from "@/lib/session";
import { createCharacterForUser } from "@/services/characters";

type Result =
  | { success: true; characterId: string }
  | { success: false; error: string };

export async function createCharacterAction(formData: FormData): Promise<Result> {
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim().length === 0) {
    return { success: false, error: "Character name is required." };
  }

  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    const character = await createCharacterForUser({ name: name.trim(), ownerId: user.id });
    return { success: true, characterId: character.id };
  } catch {
    return { success: false, error: "Failed to create character. Please try again." };
  }
}
