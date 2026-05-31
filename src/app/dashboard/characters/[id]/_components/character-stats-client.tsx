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
  fortBaseSave: number;
  fortMiscMod: number;
  refBaseSave: number;
  refMiscMod: number;
  willBaseSave: number;
  willMiscMod: number;
  isOwner: boolean;
};

export default function CharacterStatsClient({
  characterId,
  scores: initialScores,
  initiativeMiscMod,
  baseAttackBonus,
  eacArmorBonus,
  eacMiscMod,
  kacArmorBonus,
  kacMiscMod,
  fortBaseSave,
  fortMiscMod,
  refBaseSave,
  refMiscMod,
  willBaseSave,
  willMiscMod,
  isOwner,
}: Props) {
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
        conScore={scores.conScore}
        wisScore={scores.wisScore}
        initiativeMiscMod={initiativeMiscMod}
        baseAttackBonus={baseAttackBonus}
        eacArmorBonus={eacArmorBonus}
        eacMiscMod={eacMiscMod}
        kacArmorBonus={kacArmorBonus}
        kacMiscMod={kacMiscMod}
        fortBaseSave={fortBaseSave}
        fortMiscMod={fortMiscMod}
        refBaseSave={refBaseSave}
        refMiscMod={refMiscMod}
        willBaseSave={willBaseSave}
        willMiscMod={willMiscMod}
        isOwner={isOwner}
      />
    </>
  );
}
