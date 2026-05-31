"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCharacterAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Race, Class, Theme, Chassis } from "@/db/schema";
import type { CharacterWithMeta } from "@/db/queries/characters";

interface Props {
  character: CharacterWithMeta;
  races: Race[];
  classes: Class[];
  themes: Theme[];
  chassisList: Chassis[];
}

export default function EditCharacterForm({ character, races, classes, themes, chassisList }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isDrone = character.raceType === "drone";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const result = await updateCharacterAction(character.id, new FormData(e.currentTarget));
    setSaving(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push(`/dashboard/characters/${character.id}`);
  }

  const selectClass = "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={character.name}
          required
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="raceId">Race</Label>
        <select
          id="raceId"
          name="raceId"
          required
          defaultValue={character.raceId ?? ""}
          className={selectClass}
        >
          <option value="" disabled>Select a race…</option>
          {races.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {isDrone && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="chassisId">Chassis</Label>
          <select
            id="chassisId"
            name="chassisId"
            required
            defaultValue={character.chassisId ?? ""}
            className={selectClass}
          >
            <option value="" disabled>Select a chassis…</option>
            {chassisList.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="classId">Class</Label>
        <select
          id="classId"
          name="classId"
          required
          defaultValue={character.classId ?? ""}
          className={selectClass}
        >
          <option value="" disabled>Select a class…</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {!isDrone && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="themeId">Theme</Label>
          <select
            id="themeId"
            name="themeId"
            required
            defaultValue={character.themeId ?? ""}
            className={selectClass}
          >
            <option value="" disabled>Select a theme…</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(`/dashboard/characters/${character.id}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
