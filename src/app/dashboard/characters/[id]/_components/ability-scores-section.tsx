"use client";

import { updateAbilityScoresAction } from "../actions";
import type { AbilityScores } from "@/db/queries/characters";
import { modifier } from "@/lib/ability";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { useCharacter } from "./character-context";

const ABILITIES: { key: keyof AbilityScores; label: string; short: string }[] = [
  { key: "strScore", label: "Strength", short: "STR" },
  { key: "dexScore", label: "Dexterity", short: "DEX" },
  { key: "conScore", label: "Constitution", short: "CON" },
  { key: "intScore", label: "Intelligence", short: "INT" },
  { key: "wisScore", label: "Wisdom", short: "WIS" },
  { key: "chaScore", label: "Charisma", short: "CHA" },
];

function formatModifier(score: number): string {
  const mod = modifier(score);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function abilitySummary(scores: AbilityScores): string {
  return `STR ${scores.strScore} / DEX ${scores.dexScore} / INT ${scores.intScore}`;
}

export default function AbilityScoresSection() {
  const { characterId, scores, setScores, raceType, isOwner } = useCharacter();
  const visibleAbilities = raceType === "drone"
    ? ABILITIES.filter((a) => a.key !== "conScore")
    : ABILITIES;
  const scheduleSave = useDebouncedSave((next: AbilityScores) =>
    updateAbilityScoresAction(characterId, next)
  );

  function adjust(key: keyof AbilityScores, delta: number) {
    const current = scores[key];
    const next = { ...scores, [key]: Math.max(1, current + delta) };
    setScores(next);
    scheduleSave(next);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {visibleAbilities.map(({ key, short }) => {
        const score = scores[key];
        const mod = formatModifier(score);
        return (
          <div
            key={key}
            className="flex flex-col items-center rounded-[9px] border"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
              padding: "10px 8px 8px",
            }}
          >
            <span
              className="uppercase leading-none mb-2"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.08em" }}
            >
              {short}
            </span>
            {isOwner ? (
              <div className="flex items-center gap-1 w-full justify-center">
                <button
                  type="button"
                  onClick={() => adjust(key, -1)}
                  className="flex items-center justify-center rounded-[7px] border transition-colors shrink-0 w-10 h-10 md:w-7 md:h-7"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--sf-accent)",
                    fontSize: 18,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  −
                </button>
                <span
                  className="text-center"
                  style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 24, color: "var(--text-1)", minWidth: 36 }}
                >
                  {score}
                </span>
                <button
                  type="button"
                  onClick={() => adjust(key, 1)}
                  className="flex items-center justify-center rounded-[7px] border transition-colors shrink-0 w-10 h-10 md:w-7 md:h-7"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--sf-accent)",
                    fontSize: 18,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  +
                </button>
              </div>
            ) : (
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 24, color: "var(--text-1)" }}>
                {score}
              </span>
            )}
            <span
              className="leading-none mt-[5px]"
              style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--sf-accent)" }}
            >
              {mod}
            </span>
          </div>
        );
      })}
    </div>
  );
}
