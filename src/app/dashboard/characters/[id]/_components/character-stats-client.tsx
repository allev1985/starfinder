"use client";

import { useState } from "react";
import AbilityScoresSection from "./ability-scores-section";
import CombatStatsSection from "./combat-stats-section";
import InventorySection from "./inventory-section";
import LevelControl from "./level-control";
import SkillsSection from "./skills-section";
import type { AbilityScores } from "@/db/queries/characters";
import type { SkillWithClassFlag } from "@/db/queries/reference";
import type { Armor, Weapon, CharacterSkill, RaceType } from "@/db/schema";

type Props = {
  characterId: string;
  raceType: RaceType | null;
  mechanicLevel: number | null;
  scores: AbilityScores;
  initialLevel: number;
  initiativeMiscMod: number;
  baseAttackBonus: number;
  initialEquippedArmor: Armor | null;
  availableArmor: Armor[];
  eacMiscMod: number;
  kacMiscMod: number;
  fortBaseSave: number;
  fortMiscMod: number;
  refBaseSave: number;
  refMiscMod: number;
  willBaseSave: number;
  willMiscMod: number;
  meleeAttackMiscMod: number;
  rangedAttackMiscMod: number;
  thrownAttackMiscMod: number;
  initialSkills: CharacterSkill[];
  allSkills: SkillWithClassFlag[];
  skillRanksPerLevel: number;
  allWeapons: Weapon[];
  initialCarriedWeapons: Weapon[];
  isOwner: boolean;
};

export default function CharacterStatsClient({
  characterId,
  raceType,
  mechanicLevel,
  scores: initialScores,
  initialLevel,
  initiativeMiscMod,
  baseAttackBonus,
  initialEquippedArmor,
  availableArmor,
  eacMiscMod,
  kacMiscMod,
  fortBaseSave,
  fortMiscMod,
  refBaseSave,
  refMiscMod,
  willBaseSave,
  willMiscMod,
  meleeAttackMiscMod,
  rangedAttackMiscMod,
  thrownAttackMiscMod,
  initialSkills,
  allSkills,
  skillRanksPerLevel,
  allWeapons,
  initialCarriedWeapons,
  isOwner,
}: Props) {
  const [scores, setScores] = useState<AbilityScores>(initialScores);
  const [level, setLevel] = useState(initialLevel);
  const [currentArmor, setCurrentArmor] = useState<Armor | null>(initialEquippedArmor);

  return (
    <>
      {isOwner ? (
        <div className="mb-8">
          <LevelControl
            characterId={characterId}
            initialLevel={initialLevel}
            onLevelChange={setLevel}
          />
        </div>
      ) : (
        <p className="mb-8 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Level</span> {level}
        </p>
      )}
      <AbilityScoresSection
        characterId={characterId}
        scores={scores}
        raceType={raceType}
        isOwner={isOwner}
        onScoreChange={setScores}
      />
      <CombatStatsSection
        characterId={characterId}
        strScore={scores.strScore}
        dexScore={scores.dexScore}
        conScore={scores.conScore}
        wisScore={scores.wisScore}
        initiativeMiscMod={initiativeMiscMod}
        baseAttackBonus={baseAttackBonus}
        equippedArmor={currentArmor}
        eacMiscMod={eacMiscMod}
        kacMiscMod={kacMiscMod}
        fortBaseSave={fortBaseSave}
        fortMiscMod={fortMiscMod}
        refBaseSave={refBaseSave}
        refMiscMod={refMiscMod}
        willBaseSave={willBaseSave}
        willMiscMod={willMiscMod}
        meleeAttackMiscMod={meleeAttackMiscMod}
        rangedAttackMiscMod={rangedAttackMiscMod}
        thrownAttackMiscMod={thrownAttackMiscMod}
        isOwner={isOwner}
      />
      <SkillsSection
        characterId={characterId}
        initialSkills={initialSkills}
        allSkills={allSkills}
        scores={scores}
        skillRanksPerLevel={skillRanksPerLevel}
        level={level}
        raceType={raceType}
        mechanicLevel={mechanicLevel}
        armorCheckPenalty={currentArmor?.armorCheckPenalty ?? 0}
        isOwner={isOwner}
      />
      <InventorySection
        characterId={characterId}
        isOwner={isOwner}
        initialEquippedArmor={currentArmor}
        availableArmor={availableArmor}
        onArmorChange={setCurrentArmor}
        allWeapons={allWeapons}
        initialCarriedWeapons={initialCarriedWeapons}
      />
    </>
  );
}
