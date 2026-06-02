"use client";

import { Fragment } from "react";
import { Input } from "@/components/ui/input";
import { updateAbilityScoresAction } from "../actions";
import type { AbilityScores } from "@/db/queries/characters";
import { modifier } from "@/lib/ability";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { useCharacter } from "./character-context";

const ABILITIES: { key: keyof AbilityScores; label: string }[] = [
  { key: "strScore", label: "Strength (STR)" },
  { key: "dexScore", label: "Dexterity (DEX)" },
  { key: "conScore", label: "Constitution (CON)" },
  { key: "intScore", label: "Intelligence (INT)" },
  { key: "wisScore", label: "Wisdom (WIS)" },
  { key: "chaScore", label: "Charisma (CHA)" },
];

function formatModifier(score: number): string {
  const mod = modifier(score);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function AbilityScoresSection() {
  const { characterId, scores, setScores, raceType, isOwner } = useCharacter();
  const visibleAbilities = raceType === "drone"
    ? ABILITIES.filter((a) => a.key !== "conScore")
    : ABILITIES;
  const scheduleSave = useDebouncedSave((next: AbilityScores) =>
    updateAbilityScoresAction(characterId, next)
  );

  function handleChange(key: keyof AbilityScores, raw: string) {
    const value = parseInt(raw, 10);
    const next = { ...scores, [key]: isNaN(value) ? 10 : value };
    setScores(next);
    scheduleSave(next);
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
        Ability Scores
      </h2>
      <div className="grid grid-cols-[12rem_5rem_3rem] items-center gap-x-3 gap-y-2">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Score</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Modifier</span>
        {visibleAbilities.map(({ key, label }) => (
          <Fragment key={key}>
            <span className="text-sm font-medium">{label}</span>
            {isOwner ? (
              <Input
                type="number"
                value={scores[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="h-7 text-sm text-center"
              />
            ) : (
              <span className="text-sm text-center">{scores[key]}</span>
            )}
            <span className="text-sm text-muted-foreground">{formatModifier(scores[key])}</span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
