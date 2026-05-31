"use client";

import { useState } from "react";
import AbilityScoresSection from "./ability-scores-section";
import CombatStatsSection from "./combat-stats-section";
import type { AbilityScores } from "@/db/queries/characters";

type Props = {
  characterId: string;
  scores: AbilityScores;
  initiativeMiscMod: number;
  baseAttackBonus: number;
  eacArmorBonus: number;
  eacMiscMod: number;
  kacArmorBonus: number;
  kacMiscMod: number;
  isOwner: boolean;
};

export default function CharacterStatsClient({ characterId, scores: initialScores, initiativeMiscMod, baseAttackBonus, eacArmorBonus, eacMiscMod, kacArmorBonus, kacMiscMod, isOwner }: Props) {
  const [scores, setScores] = useState<AbilityScores>(initialScores);

  return (
    <>
      <AbilityScoresSection
        characterId={characterId}
        scores={scores}
        isOwner={isOwner}
        onScoreChange={setScores}
      />
      <CombatStatsSection
        characterId={characterId}
        dexScore={scores.dexScore}
        initiativeMiscMod={initiativeMiscMod}
        baseAttackBonus={baseAttackBonus}
        eacArmorBonus={eacArmorBonus}
        eacMiscMod={eacMiscMod}
        kacArmorBonus={kacArmorBonus}
        kacMiscMod={kacMiscMod}
        isOwner={isOwner}
      />
    </>
  );
}
