"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { upsertDescriptionValueAction } from "../actions";
import type { RaceDescription } from "@/db/schema";

type Props = {
  characterId: string;
  descriptions: RaceDescription[];
  savedValues: Record<string, string>;
  isOwner: boolean;
};

export default function DescriptionSection({ characterId, descriptions, savedValues, isOwner }: Props) {
  const pendingRef = useRef<Record<string, string>>({});

  async function handleBlur(descriptionId: string, value: string) {
    if (pendingRef.current[descriptionId] === value) return;
    pendingRef.current[descriptionId] = value;
    await upsertDescriptionValueAction(characterId, descriptionId, value);
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
        Description
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {descriptions.map((desc) => (
          <div key={desc.id} className="flex items-center gap-2">
            <span className="shrink-0 text-xs font-medium">{desc.name}</span>
            {isOwner ? (
              <Input
                defaultValue={savedValues[desc.id] ?? ""}
                onBlur={(e) => handleBlur(desc.id, e.target.value)}
                className="h-6 w-24 text-xs"
              />
            ) : (
              <span className="text-xs text-muted-foreground">
                {savedValues[desc.id] || "—"}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
