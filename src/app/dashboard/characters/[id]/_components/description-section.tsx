"use client";

import { Fragment, useRef } from "react";
import { Input } from "@/components/ui/input";
import { upsertRaceAttributeValueAction } from "../actions";
import type { RaceAttribute } from "@/db/schema";

type Props = {
  characterId: string;
  attributes: RaceAttribute[];
  savedValues: Record<string, string>;
  isOwner: boolean;
};

export default function DescriptionSection({ characterId, attributes, savedValues, isOwner }: Props) {
  const pendingRef = useRef<Record<string, string>>({});

  async function handleBlur(attributeId: string, value: string) {
    if (pendingRef.current[attributeId] === value) return;
    pendingRef.current[attributeId] = value;
    await upsertRaceAttributeValueAction(characterId, attributeId, value);
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Description
      </h2>
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 max-w-sm">
        {attributes.map((attr) => (
          <Fragment key={attr.id}>
            <span className="text-sm font-medium">
              {attr.name}
            </span>
            {isOwner ? (
              <Input
                defaultValue={savedValues[attr.id] ?? ""}
                onBlur={(e) => handleBlur(attr.id, e.target.value)}
                className="h-7 text-sm"
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                {savedValues[attr.id] || "—"}
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
