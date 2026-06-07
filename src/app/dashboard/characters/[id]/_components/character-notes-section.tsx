"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { addCharacterNoteAction, removeCharacterNoteAction, updateCharacterNoteAction } from "../actions";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { useCharacter } from "./character-context";
import type { CharacterNote } from "@/db/schema";

type NoteType = "ability" | "proficiency" | "note";

function NoteRow({
  note,
  characterId,
  isOwner,
  onRemove,
  onUpdate,
}: {
  note: CharacterNote;
  characterId: string;
  isOwner: boolean;
  onRemove: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const scheduleSave = useDebouncedSave((value: string) =>
    updateCharacterNoteAction(characterId, note.id, value)
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    onUpdate(note.id, value);
    scheduleSave(value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "Escape") {
      setEditing(false);
    }
  }

  async function handleRemove() {
    const result = await removeCharacterNoteAction(characterId, note.id);
    if (result.success) onRemove(note.id);
  }

  return (
    <div className="flex items-center justify-between gap-2 py-1 border-b border-border last:border-0">
      {editing && isOwner ? (
        <Input
          autoFocus
          value={note.content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditing(false)}
          className="h-7 text-sm"
        />
      ) : (
        <span
          className={`text-sm flex-1 min-w-0 truncate ${isOwner ? "cursor-text hover:text-foreground/80" : ""}`}
          onClick={() => isOwner && setEditing(true)}
          title={note.content}
        >
          {note.content}
        </span>
      )}
      {isOwner && !editing && (
        <button
          onClick={handleRemove}
          className="shrink-0 text-muted-foreground hover:text-destructive"
          aria-label={`Remove ${note.content}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default function CharacterNotesSection({
  type,
  title,
}: {
  type: NoteType;
  title: string;
}) {
  const { characterId, isOwner, notes, setNotes } = useCharacter();
  const filtered = notes.filter((n) => n.type === type);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleAdd() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const result = await addCharacterNoteAction(characterId, type, trimmed);
    if (result.success) {
      setNotes([...notes, result.note]);
      setInputValue("");
      inputRef.current?.focus();
    }
  }

  function handleRemove(id: string) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  function handleUpdate(id: string, content: string) {
    setNotes(notes.map((n) => n.id === id ? { ...n, content } : n));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <section className="mb-6">
      <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
        {title}
      </h2>

      {filtered.length === 0 && !isOwner ? (
        <p className="text-sm text-muted-foreground">No entries recorded.</p>
      ) : (
        <div className="flex flex-col">
          {filtered.map((note) => (
            <NoteRow
              key={note.id}
              note={note}
              characterId={characterId}
              isOwner={isOwner}
              onRemove={handleRemove}
              onUpdate={handleUpdate}
            />
          ))}
          {filtered.length === 0 && isOwner && (
            <p className="text-sm text-muted-foreground">No entries added.</p>
          )}
        </div>
      )}

      {isOwner && (
        <div className="mt-3 flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Add ${title.toLowerCase()}…`}
            className="h-8 max-w-[260px] text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="h-8"
          >
            Add
          </Button>
        </div>
      )}
    </section>
  );
}
