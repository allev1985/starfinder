"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { updateHealthResolveAction } from "../actions";
import type { HealthResolveValues } from "@/db/queries/characters";

type Props = {
  characterId: string;
  isOwner: boolean;
} & HealthResolveValues;

const ROWS: { label: string; totalKey: keyof HealthResolveValues; currentKey: keyof HealthResolveValues }[] = [
  { label: "Stamina Points", totalKey: "staminaPointsTotal", currentKey: "staminaPointsCurrent" },
  { label: "Hit Points",     totalKey: "hitPointsTotal",     currentKey: "hitPointsCurrent" },
  { label: "Resolve Points", totalKey: "resolvePointsTotal", currentKey: "resolvePointsCurrent" },
];

const SAVE_DELAY_MS = 600;

export default function HealthResolveSection({
  characterId,
  isOwner,
  staminaPointsTotal,
  staminaPointsCurrent,
  hitPointsTotal,
  hitPointsCurrent,
  resolvePointsTotal,
  resolvePointsCurrent,
}: Props) {
  const [values, setValues] = useState<HealthResolveValues>({
    staminaPointsTotal,
    staminaPointsCurrent,
    hitPointsTotal,
    hitPointsCurrent,
    resolvePointsTotal,
    resolvePointsCurrent,
  });

  const pendingRef = useRef<HealthResolveValues | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current) {
        updateHealthResolveAction(characterId, pendingRef.current);
      }
    };
  }, [characterId]);

  function scheduleSave(next: HealthResolveValues) {
    pendingRef.current = next;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      pendingRef.current = null;
      updateHealthResolveAction(characterId, next);
    }, SAVE_DELAY_MS);
  }

  function handleChange(key: keyof HealthResolveValues, raw: string) {
    const parsed = parseInt(raw, 10);
    const clamped = isNaN(parsed) ? 0 : Math.max(0, parsed);
    const next = { ...values, [key]: clamped };

    for (const { totalKey, currentKey } of ROWS) {
      if (key === totalKey) next[currentKey] = Math.min(next[currentKey], clamped);
      if (key === currentKey) next[currentKey] = Math.min(clamped, next[totalKey]);
    }

    setValues(next);
    scheduleSave(next);
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Health &amp; Resolve
      </h2>
      <div className="grid grid-cols-[12rem_5rem_5rem] items-center gap-x-3 gap-y-2">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Total</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Current</span>

        {ROWS.map(({ label, totalKey, currentKey }) => (
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
