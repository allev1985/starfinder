"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import {
  saveSessionMetadataAction,
  saveDmNoteAction,
  saveCharacterNoteAction,
  deleteSessionAction,
} from "../actions";
import type { SessionNote, Character } from "@/db/schema";
import type { SessionNoteContent } from "../actions";

type Props = {
  campaignId: string;
  session: SessionNote;
  characters: Character[];
  initialContent: SessionNoteContent;
  isDm: boolean;
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="uppercase tracking-[0.1em] mb-2"
      style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}
    >
      {children}
    </p>
  );
}

function NoteTextarea({
  initialValue,
  onSave,
}: {
  initialValue: string;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const scheduleSave = useDebouncedSave(onSave);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    scheduleSave(e.target.value);
  }

  return (
    <Textarea
      value={value}
      onChange={handleChange}
      rows={6}
      placeholder="Write notes here…"
      style={{ resize: "vertical" }}
    />
  );
}

export default function SessionDetailClient({
  campaignId,
  session,
  characters,
  initialContent,
  isDm,
}: Props) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [title, setTitle] = useState(session.title);
  const [sessionNumber, setSessionNumber] = useState(
    session.sessionNumber != null ? String(session.sessionNumber) : ""
  );
  const [sessionDate, setSessionDate] = useState(session.sessionDate ?? "");

  const scheduleMetaSave = useDebouncedSave(
    (data: { title: string; sessionNumber: string; sessionDate: string }) => {
      saveSessionMetadataAction(campaignId, session.id, {
        title: data.title || session.title,
        sessionNumber: data.sessionNumber ? parseInt(data.sessionNumber, 10) || null : null,
        sessionDate: data.sessionDate || null,
      });
    }
  );

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    scheduleMetaSave({ title: e.target.value, sessionNumber, sessionDate });
  }

  function handleSessionNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSessionNumber(e.target.value);
    scheduleMetaSave({ title, sessionNumber: e.target.value, sessionDate });
  }

  function handleSessionDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSessionDate(e.target.value);
    scheduleMetaSave({ title, sessionNumber, sessionDate: e.target.value });
  }

  async function handleDelete() {
    await deleteSessionAction(campaignId, session.id);
    router.push(`/dashboard/campaigns/${campaignId}/sessions`);
  }

  return (
    <div className="p-5 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              value={sessionNumber}
              onChange={handleSessionNumberChange}
              type="number"
              placeholder="#"
              min={1}
              style={{ width: 64, fontFamily: "var(--font-mono)", fontSize: 13 }}
            />
            <Input
              value={title}
              onChange={handleTitleChange}
              placeholder="Session title"
              style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 16 }}
            />
          </div>
          <Input
            type="date"
            value={sessionDate}
            onChange={handleSessionDateChange}
            style={{ width: 180 }}
          />
        </div>
        {isDm && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={16} />
            </Button>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete session?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes the session and all notes. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {/* DM Notes */}
      <div className="mb-6">
        <SectionLabel>DM Notes</SectionLabel>
        <NoteTextarea
          initialValue={initialContent.dm}
          onSave={(value) => saveDmNoteAction(campaignId, session.id, value)}
        />
      </div>

      {/* Character Notes */}
      {characters.length > 0 && (
        <div className="flex flex-col gap-4">
          <SectionLabel>Character Notes</SectionLabel>
          {characters.map((character) => (
            <div key={character.id}>
              <Label
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--text-1)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {character.name}
              </Label>
              <NoteTextarea
                initialValue={initialContent.characters[character.id] ?? ""}
                onSave={(value) =>
                  saveCharacterNoteAction(campaignId, session.id, character.id, value)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
