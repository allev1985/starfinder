"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateCharacterLevelAction } from "../actions";

interface Props {
  characterId: string;
  initialLevel: number;
  onLevelChange?: (level: number) => void;
}

export default function LevelControl({ characterId, initialLevel, onLevelChange }: Props) {
  const [level, setLevel] = useState(initialLevel);
  const [error, setError] = useState<string | null>(null);

  async function changeLevel(next: number) {
    if (next < 1 || next > 20) return;
    const prev = level;
    setLevel(next);
    onLevelChange?.(next);
    setError(null);
    const result = await updateCharacterLevelAction(characterId, next);
    if (!result.success) {
      setLevel(prev);
      onLevelChange?.(prev);
      setError(result.error);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => changeLevel(level - 1)}
          disabled={level <= 1}
          aria-label="Decrease level"
        >
          −
        </Button>
        <span className="w-16 text-center text-sm font-medium">Level {level}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => changeLevel(level + 1)}
          disabled={level >= 20}
          aria-label="Increase level"
        >
          +
        </Button>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
