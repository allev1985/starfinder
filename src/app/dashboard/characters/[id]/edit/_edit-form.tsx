"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCharacterAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Character } from "@/db/schema";

export default function EditCharacterForm({ character }: { character: Character }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      {error && <p className="text-sm text-destructive">{error}</p>}
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
