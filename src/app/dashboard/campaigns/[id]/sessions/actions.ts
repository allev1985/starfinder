"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { isCampaignParticipant } from "@/lib/authorization";
import { createClient } from "@/lib/supabase/server";
import {
  listSessionsByCampaign,
  createSessionNote,
  updateSessionMetadata,
  upsertCharacterEntry,
  deleteSessionNote,
  getSessionWithEntries,
} from "@/db/queries/campaigns";

const BUCKET = "session-notes";

function gmBlobPath(campaignId: string, sessionId: string) {
  return `campaigns/${campaignId}/sessions/${sessionId}/gm`;
}

function charBlobPath(campaignId: string, sessionId: string, characterId: string) {
  return `campaigns/${campaignId}/sessions/${sessionId}/chars/${characterId}`;
}

type Result = { success: true } | { success: false; error: string };

export async function createSessionAction(
  campaignId: string,
  formData: FormData
): Promise<void> {
  const user = await getUser();
  if (!user) redirect("/");

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) redirect("/dashboard/campaigns");

  const title = (formData.get("title") as string | null)?.trim();
  if (!title) return;

  const sessionNumberRaw = formData.get("sessionNumber") as string | null;
  const sessionNumber = sessionNumberRaw ? parseInt(sessionNumberRaw, 10) || null : null;
  const sessionDate = (formData.get("sessionDate") as string | null)?.trim() || null;

  const session = await createSessionNote({
    campaignId,
    title,
    sessionNumber,
    sessionDate,
  });

  revalidatePath(`/dashboard/campaigns/${campaignId}/sessions`);
  redirect(`/dashboard/campaigns/${campaignId}/sessions/${session.id}`);
}

export async function saveSessionMetadataAction(
  campaignId: string,
  sessionId: string,
  data: { title?: string; sessionNumber?: number | null; sessionDate?: string | null }
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  try {
    await updateSessionMetadata(sessionId, data);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save." };
  }
}

export async function saveGmNoteAction(
  campaignId: string,
  sessionId: string,
  content: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  const supabase = await createClient();
  const path = gmBlobPath(campaignId, sessionId);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, content, { upsert: true, contentType: "text/plain" });

  if (error) return { success: false, error: error.message };

  await updateSessionMetadata(sessionId, { gmStoragePath: path });
  return { success: true };
}

export async function saveCharacterNoteAction(
  campaignId: string,
  sessionId: string,
  characterId: string,
  content: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  const supabase = await createClient();
  const path = charBlobPath(campaignId, sessionId, characterId);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, content, { upsert: true, contentType: "text/plain" });

  if (error) return { success: false, error: error.message };

  await upsertCharacterEntry(sessionId, characterId, path);
  return { success: true };
}

export async function deleteSessionAction(
  campaignId: string,
  sessionId: string
): Promise<Result> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { success: false, error: "Not authorized." };

  const supabase = await createClient();

  const { data: blobs } = await supabase.storage
    .from(BUCKET)
    .list(`campaigns/${campaignId}/sessions/${sessionId}`);

  if (blobs && blobs.length > 0) {
    const paths = blobs.map((b) => `campaigns/${campaignId}/sessions/${sessionId}/${b.name}`);
    await supabase.storage.from(BUCKET).remove(paths);
  }

  const charsPrefix = `campaigns/${campaignId}/sessions/${sessionId}/chars`;
  const { data: charBlobs } = await supabase.storage.from(BUCKET).list(charsPrefix);
  if (charBlobs && charBlobs.length > 0) {
    const paths = charBlobs.map((b) => `${charsPrefix}/${b.name}`);
    await supabase.storage.from(BUCKET).remove(paths);
  }

  await deleteSessionNote(sessionId);
  revalidatePath(`/dashboard/campaigns/${campaignId}/sessions`);
  return { success: true };
}

export type SessionNoteContent = {
  gm: string;
  characters: Record<string, string>;
};

export async function loadSessionNoteContentAction(
  campaignId: string,
  sessionId: string
): Promise<SessionNoteContent> {
  const user = await getUser();
  if (!user) return { gm: "", characters: {} };

  const allowed = await isCampaignParticipant(campaignId, user.id);
  if (!allowed) return { gm: "", characters: {} };

  const supabase = await createClient();
  const { session, entries } = await getSessionWithEntries(sessionId);

  async function readBlob(path: string): Promise<string> {
    const { data, error } = await supabase.storage.from(BUCKET).download(path);
    if (error || !data) return "";
    return data.text();
  }

  const [gmText, ...charTexts] = await Promise.all([
    session?.gmStoragePath ? readBlob(session.gmStoragePath) : Promise.resolve(""),
    ...entries.map((e) => readBlob(e.storagePath)),
  ]);

  const characters: Record<string, string> = {};
  entries.forEach((e, i) => {
    characters[e.characterId] = charTexts[i] ?? "";
  });

  return { gm: gmText, characters };
}

export { listSessionsByCampaign, getSessionWithEntries };
