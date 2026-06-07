"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { upsertDescriptionValueAction } from "../actions";
import type { RaceDescription } from "@/db/schema";
import { useCharacter } from "./character-context";

// These field names represent base land movement — armor speed penalty applies here.
// Fly Speed / Climb Speed are special granted modes and are unaffected by armor.
const LAND_SPEED_FIELDS = new Set(["Walking Speed", "Running Speed", "Land Speed"]);

type Props = {
  descriptions: RaceDescription[];
  savedValues: Record<string, string>;
};

export default function DescriptionSection({ descriptions, savedValues }: Props) {
  const { characterId, isOwner, equippedArmor } = useCharacter();
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
        {descriptions.map((desc) => {
          const rawValue = savedValues[desc.id] ?? "";
          const isSpeedField = LAND_SPEED_FIELDS.has(desc.name);
          const armorPenalty = isSpeedField ? (equippedArmor?.speedAdjustment ?? 0) : 0;
          const baseSpeed = isSpeedField ? parseInt(rawValue, 10) : NaN;
          const effectiveSpeed = !isNaN(baseSpeed) && armorPenalty !== 0 ? baseSpeed + armorPenalty : null;

          return (
            <div key={desc.id} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-xs font-medium">{desc.name}</span>
                {isOwner ? (
                  <div className="flex items-center gap-1">
                    <Input
                      defaultValue={rawValue}
                      onBlur={(e) => handleBlur(desc.id, e.target.value)}
                      className="h-6 w-20 text-xs"
                      placeholder={isSpeedField ? "ft" : ""}
                    />
                    {isSpeedField && !isNaN(baseSpeed) && (
                      <span className="text-xs text-muted-foreground">ft</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {isSpeedField && !isNaN(baseSpeed)
                      ? `${baseSpeed} ft`
                      : rawValue || "—"}
                  </span>
                )}
              </div>
              {isSpeedField && effectiveSpeed !== null && (
                <span className="text-xs text-muted-foreground pl-1">
                  {effectiveSpeed} ft effective ({baseSpeed} − {Math.abs(armorPenalty)} armor)
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
