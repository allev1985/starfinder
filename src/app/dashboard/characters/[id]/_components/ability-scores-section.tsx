"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { updateAbilityScoresAction } from "../actions";
import type { AbilityScores } from "@/db/queries/characters";
import { modifier } from "@/lib/ability";

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

type Props = {
  characterId: string;
  scores: AbilityScores;
  isOwner: boolean;
  onScoreChange?: (scores: AbilityScores) => void;
};

const SAVE_DELAY_MS = 600;

export default function AbilityScoresSection({ characterId, scores, isOwner, onScoreChange }: Props) {
  const [current, setCurrent] = useState<AbilityScores>({ ...scores });
  const pendingRef = useRef<AbilityScores | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current) {
        updateAbilityScoresAction(characterId, pendingRef.current);
      }
    };
  }, [characterId]);

  function scheduleSave(next: AbilityScores) {
    pendingRef.current = next;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      pendingRef.current = null;
      updateAbilityScoresAction(characterId, next);
    }, SAVE_DELAY_MS);
  }

  function handleChange(key: keyof AbilityScores, raw: string) {
    const value = parseInt(raw, 10);
    const next = { ...current, [key]: isNaN(value) ? 10 : value };
    setCurrent(next);
    onScoreChange?.(next);
    scheduleSave(next);
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Ability Scores
      </h2>
      <div className="grid grid-cols-[12rem_5rem_3rem] items-center gap-x-3 gap-y-2">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Score</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Modifier</span>
        {ABILITIES.map(({ key, label }) => (
          <Fragment key={key}>
            <span className="text-sm font-medium">{label}</span>
            {isOwner ? (
              <Input
                type="number"
                value={current[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="h-7 text-sm text-center"
              />
            ) : (
              <span className="text-sm text-center">{current[key]}</span>
            )}
            <span className="text-sm text-muted-foreground">{formatModifier(current[key])}</span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
