"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { updateHealthResolveAction } from "../actions";
import type { HealthResolveValues } from "@/db/queries/characters";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { useCharacter } from "./character-context";

const BIOLOGICAL_ROWS: { label: string; totalKey: keyof HealthResolveValues; currentKey: keyof HealthResolveValues }[] = [
  { label: "Stamina Points", totalKey: "staminaPointsTotal", currentKey: "staminaPointsCurrent" },
  { label: "Hit Points",     totalKey: "hitPointsTotal",     currentKey: "hitPointsCurrent" },
  { label: "Resolve Points", totalKey: "resolvePointsTotal", currentKey: "resolvePointsCurrent" },
];

const DRONE_ROWS: { label: string; totalKey: keyof HealthResolveValues; currentKey: keyof HealthResolveValues }[] = [
  { label: "Hit Points", totalKey: "hitPointsTotal", currentKey: "hitPointsCurrent" },
];

export default function HealthResolveSection() {
  const { characterId, isOwner, raceType, healthValues: values, setHealthValues: onValuesChange } = useCharacter();
  const isDrone = raceType === "drone";
  const rows = isDrone ? DRONE_ROWS : BIOLOGICAL_ROWS;

  const scheduleSave = useDebouncedSave((next: HealthResolveValues) =>
    updateHealthResolveAction(characterId, next)
  );

  function handleChange(key: keyof HealthResolveValues, raw: string) {
    const parsed = parseInt(raw, 10);
    const clamped = isNaN(parsed) ? 0 : Math.max(0, parsed);
    const next = { ...values, [key]: clamped };

    for (const { totalKey, currentKey } of rows) {
      if (key === totalKey) next[currentKey] = Math.min(next[currentKey], clamped);
      if (key === currentKey) next[currentKey] = Math.min(clamped, next[totalKey]);
    }

    onValuesChange(next);
    scheduleSave(next);
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
        {isDrone ? "Hit Points" : "Health & Resolve"}
      </h2>
      <div className="grid grid-cols-[12rem_5rem_5rem] items-center gap-x-3 gap-y-2">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Total</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Current</span>

        {rows.map(({ label, totalKey, currentKey }) => (
          <React.Fragment key={label}>
            <span className="text-sm font-medium">{label}</span>
            {isOwner ? (
              <>
                <Input
                  type="number"
                  min={0}
                  value={values[totalKey]}
                  onChange={(e) => handleChange(totalKey, e.target.value)}
                  className="h-7 text-sm text-center"
                />
                <Input
                  type="number"
                  min={0}
                  max={values[totalKey]}
                  value={values[currentKey]}
                  onChange={(e) => handleChange(currentKey, e.target.value)}
                  className="h-7 text-sm text-center"
                />
              </>
            ) : (
              <>
                <span className="text-sm text-center">{values[totalKey]}</span>
                <span className="text-sm text-center">{values[currentKey]}</span>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
