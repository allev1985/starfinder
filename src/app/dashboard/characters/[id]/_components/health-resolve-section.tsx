"use client";

import ResourceBar from "@/components/resource-bar";
import { updateHealthResolveAction } from "../actions";
import type { HealthResolveValues } from "@/db/queries/characters";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { useCharacter } from "./character-context";

export default function HealthResolveSection() {
  const { characterId, isOwner, raceType, healthValues: values, setHealthValues: onValuesChange } = useCharacter();
  const isDrone = raceType === "drone";

  const scheduleSave = useDebouncedSave((next: HealthResolveValues) =>
    updateHealthResolveAction(characterId, next)
  );

  function adjustCurrent(currentKey: keyof HealthResolveValues, totalKey: keyof HealthResolveValues, delta: number) {
    const next = { ...values };
    next[currentKey] = Math.min(Math.max(0, values[currentKey] + delta), values[totalKey]);
    onValuesChange(next);
    scheduleSave(next);
  }

  function setMax(totalKey: keyof HealthResolveValues, currentKey: keyof HealthResolveValues, newTotal: number) {
    const next = { ...values };
    const reduction = values[totalKey] - values[currentKey];
    next[totalKey] = newTotal;
    next[currentKey] = Math.max(0, newTotal - reduction);
    onValuesChange(next);
    scheduleSave(next);
  }

  return (
    <div>
      {!isDrone && (
        <ResourceBar
          label="Stamina"
          color="accent"
          current={values.staminaPointsCurrent}
          max={values.staminaPointsTotal}
          readOnly={!isOwner}
          onDecrement={() => adjustCurrent("staminaPointsCurrent", "staminaPointsTotal", -1)}
          onIncrement={() => adjustCurrent("staminaPointsCurrent", "staminaPointsTotal", 1)}
          onMaxChange={(v) => setMax("staminaPointsTotal", "staminaPointsCurrent", v)}
        />
      )}
      <ResourceBar
        label="Hit Points"
        color="good"
        current={values.hitPointsCurrent}
        max={values.hitPointsTotal}
        readOnly={!isOwner}
        onDecrement={() => adjustCurrent("hitPointsCurrent", "hitPointsTotal", -1)}
        onIncrement={() => adjustCurrent("hitPointsCurrent", "hitPointsTotal", 1)}
        onMaxChange={(v) => setMax("hitPointsTotal", "hitPointsCurrent", v)}
      />
      {!isDrone && (
        <ResourceBar
          label="Resolve"
          color="warn"
          current={values.resolvePointsCurrent}
          max={values.resolvePointsTotal}
          readOnly={!isOwner}
          onDecrement={() => adjustCurrent("resolvePointsCurrent", "resolvePointsTotal", -1)}
          onIncrement={() => adjustCurrent("resolvePointsCurrent", "resolvePointsTotal", 1)}
          onMaxChange={(v) => setMax("resolvePointsTotal", "resolvePointsCurrent", v)}
        />
      )}
    </div>
  );
}
