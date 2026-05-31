"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMechanicLinkAction } from "../actions";
import { modifier } from "@/lib/ability";
import type { MechanicPickerEntry } from "@/db/queries/characters";

const SELECT_CLASS = "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

type Props = {
  characterId: string;
  isOwner: boolean;
  mechanicCharacterId: string | null;
  mechanicName: string | null;
  mechanicLevel: number | null;
  mechanicIntScore: number | null;
  pickerOptions: MechanicPickerEntry[];
};

function formatMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export default function MechanicPanel({
  characterId,
  isOwner,
  mechanicCharacterId: initialMechanicId,
  mechanicName: initialMechanicName,
  mechanicLevel: initialMechanicLevel,
  mechanicIntScore: initialMechanicIntScore,
  pickerOptions,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string>(initialMechanicId ?? "");

  const selectedEntry = pickerOptions.find((p) => p.id === selectedId) ?? null;
  const displayName = selectedEntry?.name ?? initialMechanicName;
  const displayLevel = selectedEntry?.level ?? initialMechanicLevel;
  const displayIntScore = selectedEntry?.intScore ?? initialMechanicIntScore;
  const displayIntMod = displayIntScore !== null ? formatMod(modifier(displayIntScore)) : null;

  function handleChange(value: string) {
    setSelectedId(value);
    startTransition(async () => {
      await updateMechanicLinkAction(characterId, value || null);
      router.refresh();
    });
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Mechanic
      </h2>
      <div className="grid grid-cols-[12rem_1fr] items-center gap-x-3 gap-y-2">
        <span className="text-sm font-medium">Linked Mechanic</span>
        {isOwner ? (
          <select
            value={selectedId}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isPending}
            className={SELECT_CLASS}
          >
            <option value="">— None —</option>
            {pickerOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}{p.isMechanic ? " (Mechanic)" : ""}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm">{displayName ?? "None"}</span>
        )}

        {(selectedId || initialMechanicId) && (
          <>
            <span className="text-sm font-medium">Level</span>
            <span className="text-sm text-muted-foreground">{displayLevel ?? "—"}</span>

            <span className="text-sm font-medium">INT Modifier</span>
            <span className="text-sm text-muted-foreground">{displayIntMod ?? "—"}</span>
          </>
        )}

        {!selectedId && !initialMechanicId && !isOwner && (
          <span className="col-span-2 text-sm text-muted-foreground">No mechanic linked.</span>
        )}
      </div>
    </section>
  );
}
