"use client";

import { Fragment, useRef } from "react";
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
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Description
      </h2>
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 max-w-sm">
        {descriptions.map((desc) => (
          <Fragment key={desc.id}>
            <span className="text-sm font-medium">
              {desc.name}
            </span>
            {isOwner ? (
              <Input
                defaultValue={savedValues[desc.id] ?? ""}
                onBlur={(e) => handleBlur(desc.id, e.target.value)}
                className="h-7 text-sm"
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                {savedValues[desc.id] || "—"}
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
