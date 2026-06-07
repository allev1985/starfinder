"use client";

import { createContext, useContext, useState } from "react";
import type { AbilityScores, CharacterFeatWithName, CharacterArmorEntry, CharacterEquipmentEntry, HealthResolveValues } from "@/db/queries/characters";
import type { Armor, Weapon, RaceType, CharacterSkill, CharacterNote, CharacterClassChoice, Condition } from "@/db/schema";

export type CombatMods = {
  initiativeMiscMod: number;
  baseAttackBonus: number;
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
};

type CharacterContextValue = {
  characterId: string;
  isOwner: boolean;
  raceType: RaceType | null;
  mechanicLevel: number | null;
  scores: AbilityScores;
  setScores: (scores: AbilityScores) => void;
  level: number;
  setLevel: (level: number) => void;
  equippedArmor: Armor | null;
  setEquippedArmor: (armor: Armor | null) => void;
  armorInventory: CharacterArmorEntry[];
  setArmorInventory: (inventory: CharacterArmorEntry[]) => void;
  carriedWeapons: Weapon[];
  setCarriedWeapons: (weapons: Weapon[]) => void;
  equipmentInventory: CharacterEquipmentEntry[];
  setEquipmentInventory: (inventory: CharacterEquipmentEntry[]) => void;
  skills: CharacterSkill[];
  setSkills: (skills: CharacterSkill[]) => void;
  feats: CharacterFeatWithName[];
  setFeats: (feats: CharacterFeatWithName[]) => void;
  choices: CharacterClassChoice[];
  setChoices: (choices: CharacterClassChoice[]) => void;
  languages: string[];
  setLanguages: (languages: string[]) => void;
  notes: CharacterNote[];
  setNotes: (notes: CharacterNote[]) => void;
  credits: number;
  setCredits: (credits: number) => void;
  xpEarned: number;
  setXpEarned: (xp: number) => void;
  healthValues: HealthResolveValues;
  setHealthValues: (values: HealthResolveValues) => void;
  combatMods: CombatMods;
  setCombatMods: (mods: CombatMods) => void;
  activeConditions: Condition[];
  setActiveConditions: (conditions: Condition[]) => void;
};

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function useCharacter(): CharacterContextValue {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error("useCharacter must be used inside CharacterProvider");
  return ctx;
}

type ProviderProps = {
  characterId: string;
  isOwner: boolean;
  raceType: RaceType | null;
  mechanicLevel: number | null;
  initialScores: AbilityScores;
  initialLevel: number;
  initialEquippedArmor: Armor | null;
  initialArmorInventory: CharacterArmorEntry[];
  initialCarriedWeapons: Weapon[];
  initialEquipmentInventory: CharacterEquipmentEntry[];
  initialSkills: CharacterSkill[];
  initialFeats: CharacterFeatWithName[];
  initialChoices: CharacterClassChoice[];
  initialLanguages: string[];
  initialNotes: CharacterNote[];
  initialCredits: number;
  initialXpEarned: number;
  initialHealthValues: HealthResolveValues;
  initialCombatMods: CombatMods;
  initialActiveConditions: Condition[];
  children: React.ReactNode;
};

export function CharacterProvider({
  characterId,
  isOwner,
  raceType,
  mechanicLevel,
  initialScores,
  initialLevel,
  initialEquippedArmor,
  initialArmorInventory,
  initialCarriedWeapons,
  initialEquipmentInventory,
  initialSkills,
  initialFeats,
  initialChoices,
  initialLanguages,
  initialNotes,
  initialCredits,
  initialXpEarned,
  initialHealthValues,
  initialCombatMods,
  initialActiveConditions,
  children,
}: ProviderProps) {
  const [scores, setScores] = useState<AbilityScores>(initialScores);
  const [level, setLevel] = useState(initialLevel);
  const [equippedArmor, setEquippedArmor] = useState<Armor | null>(initialEquippedArmor);
  const [armorInventory, setArmorInventory] = useState(initialArmorInventory);
  const [carriedWeapons, setCarriedWeapons] = useState<Weapon[]>(initialCarriedWeapons);
  const [equipmentInventory, setEquipmentInventory] = useState(initialEquipmentInventory);
  const [skills, setSkills] = useState<CharacterSkill[]>(initialSkills);
  const [feats, setFeats] = useState<CharacterFeatWithName[]>(initialFeats);
  const [choices, setChoices] = useState<CharacterClassChoice[]>(initialChoices);
  const [languages, setLanguages] = useState<string[]>(initialLanguages);
  const [notes, setNotes] = useState<CharacterNote[]>(initialNotes);
  const [credits, setCredits] = useState(initialCredits);
  const [xpEarned, setXpEarned] = useState(initialXpEarned);
  const [healthValues, setHealthValues] = useState<HealthResolveValues>(initialHealthValues);
  const [combatMods, setCombatMods] = useState<CombatMods>(initialCombatMods);
  const [activeConditions, setActiveConditions] = useState<Condition[]>(initialActiveConditions);

  return (
    <CharacterContext.Provider value={{
      characterId, isOwner, raceType, mechanicLevel,
      scores, setScores,
      level, setLevel,
      equippedArmor, setEquippedArmor,
      armorInventory, setArmorInventory,
      carriedWeapons, setCarriedWeapons,
      equipmentInventory, setEquipmentInventory,
      skills, setSkills,
      feats, setFeats,
      choices, setChoices,
      languages, setLanguages,
      notes, setNotes,
      credits, setCredits,
      xpEarned, setXpEarned,
      healthValues, setHealthValues,
      combatMods, setCombatMods,
      activeConditions, setActiveConditions,
    }}>
      {children}
    </CharacterContext.Provider>
  );
}
