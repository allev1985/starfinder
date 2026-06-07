"use client";

import { useState } from "react";
import {
  Heart, Zap, List, Shield, Sword, Sparkles, User, BookOpen, Star, Wrench, Languages,
} from "lucide-react";
import AccordionBlock from "@/components/accordion-block";
import { modifier } from "@/lib/ability";
import AbilityScoresSection from "./ability-scores-section";
import CombatStatsSection from "./combat-stats-section";
import HealthResolveSection from "./health-resolve-section";
import ArmorInventory from "./armor-inventory";
import WeaponCard from "./weapon-card";
import WeaponPicker from "./weapon-picker";
import EquipmentInventory from "./equipment-inventory";
import LevelControl from "./level-control";
import SkillsSection from "./skills-section";
import ClassFeaturesSection from "./class-features-section";
import ThemeFeaturesSection from "./theme-features-section";
import FeatsSection from "./feats-section";
import SpellsSection from "./spells-section";
import DescriptionSection from "./description-section";
import MechanicPanel from "./mechanic-panel";
import CreditsXpSection from "./credits-xp-section";
import LanguagesSection from "./languages-section";
import CharacterNotesSection from "./character-notes-section";
import { CharacterProvider, useCharacter } from "./character-context";
import CharacterRealtimeSync from "./character-realtime-sync";
import CharacterSheetHeader from "./character-sheet-header";
import VitalsStrip from "./vitals-strip";
import type { CharacterFeatWithName, CharacterArmorEntry, CharacterEquipmentEntry, MechanicPickerEntry, HealthResolveValues } from "@/db/queries/characters";
import type { AbilityScores } from "@/db/queries/characters";
import type { SkillWithClassFlag } from "@/db/queries/reference";
import type { Armor, Weapon, Equipment, CharacterSkill, RaceType, ClassAbility, ClassAbilityOption, ThemeAbility, CharacterClassChoice, WeaponCategory, CharacterSpell, Spell, RaceDescription, CharacterSpellSlot, CharacterNote, Condition } from "@/db/schema";
import type { CombatMods } from "./character-context";
import ConditionsSection from "./conditions-section";

type CharacterSpellWithSpell = CharacterSpell & { spell: Spell };

type Props = {
  characterId: string;
  characterName: string;
  raceName: string | null;
  characterClassName: string | null;
  themeName: string | null;
  raceType: RaceType | null;
  mechanicLevel: number | null;
  scores: AbilityScores;
  initialLevel: number;
  initiativeMiscMod: number;
  baseAttackBonus: number;
  initialEquippedArmor: Armor | null;
  initialCharacterArmor: CharacterArmorEntry[];
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
  allEquipment: Equipment[];
  initialCharacterEquipment: CharacterEquipmentEntry[];
  classAbilities: ClassAbility[];
  allAbilityOptions: ClassAbilityOption[];
  themeAbilities: ThemeAbility[];
  weaponProficiencies: WeaponCategory[];
  initialChoices: CharacterClassChoice[];
  initialFeats: CharacterFeatWithName[];
  classGrantsShieldProficiency: boolean;
  hasClass: boolean;
  hasTheme: boolean;
  isOwner: boolean;
  staminaPointsTotal: number;
  staminaPointsCurrent: number;
  hitPointsTotal: number;
  hitPointsCurrent: number;
  resolvePointsTotal: number;
  resolvePointsCurrent: number;
  isSpellcaster: boolean;
  classId: string | null;
  knownSpells: CharacterSpellWithSpell[];
  spellCatalog: Record<number, Spell[]>;
  spellsKnownLimits: Record<number, number>;
  characterSpellSlots: CharacterSpellSlot[];
  spellsPerDay: Record<number, number>;
  descriptions: RaceDescription[];
  savedDescriptionValues: Record<string, string>;
  mechanicCharacterId: string | null;
  mechanicName: string | null;
  mechanicIntScore: number | null;
  pickerOptions: MechanicPickerEntry[];
  initialCredits: number;
  initialXpEarned: number;
  initialLanguages: string[];
  initialNotes: CharacterNote[];
  initialActiveConditions: Condition[];
  allConditions: Condition[];
};

export default function CharacterStatsClient({
  characterId,
  characterName,
  raceName,
  characterClassName,
  themeName,
  raceType,
  mechanicLevel,
  scores,
  initialLevel,
  initiativeMiscMod,
  baseAttackBonus,
  initialEquippedArmor,
  initialCharacterArmor,
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
  allEquipment,
  initialCharacterEquipment,
  classAbilities,
  allAbilityOptions,
  themeAbilities,
  weaponProficiencies,
  initialChoices,
  initialFeats,
  classGrantsShieldProficiency,
  hasClass,
  hasTheme,
  isOwner,
  staminaPointsTotal,
  staminaPointsCurrent,
  hitPointsTotal,
  hitPointsCurrent,
  resolvePointsTotal,
  resolvePointsCurrent,
  isSpellcaster,
  classId,
  knownSpells,
  spellCatalog,
  spellsKnownLimits,
  characterSpellSlots,
  spellsPerDay,
  descriptions,
  savedDescriptionValues,
  mechanicCharacterId,
  mechanicName,
  mechanicIntScore,
  pickerOptions,
  initialCredits,
  initialXpEarned,
  initialLanguages,
  initialNotes,
  initialActiveConditions,
  allConditions,
}: Props) {
  const initialCombatMods: CombatMods = {
    initiativeMiscMod,
    baseAttackBonus,
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
  };

  const initialHealthValues: HealthResolveValues = {
    staminaPointsTotal,
    staminaPointsCurrent,
    hitPointsTotal,
    hitPointsCurrent,
    resolvePointsTotal,
    resolvePointsCurrent,
  };

  return (
    <CharacterProvider
      characterId={characterId}
      isOwner={isOwner}
      raceType={raceType}
      mechanicLevel={mechanicLevel}
      initialScores={scores}
      initialLevel={initialLevel}
      initialEquippedArmor={initialEquippedArmor}
      initialArmorInventory={initialCharacterArmor}
      initialCarriedWeapons={initialCarriedWeapons}
      initialEquipmentInventory={initialCharacterEquipment}
      initialSkills={initialSkills}
      initialFeats={initialFeats}
      classGrantsShieldProficiency={classGrantsShieldProficiency}
      initialChoices={initialChoices}
      initialLanguages={initialLanguages}
      initialNotes={initialNotes}
      initialCredits={initialCredits}
      initialXpEarned={initialXpEarned}
      initialHealthValues={initialHealthValues}
      initialCombatMods={initialCombatMods}
      initialActiveConditions={initialActiveConditions}
    >
      <CharacterRealtimeSync allConditions={allConditions} />
      <CharacterSheetHeader
        characterName={characterName}
        raceName={raceName}
        className={characterClassName}
        themeName={themeName}
      />
      <VitalsStrip />
      <CharacterSheet
        allSkills={allSkills}
        skillRanksPerLevel={skillRanksPerLevel}
        allWeapons={allWeapons}
        allEquipment={allEquipment}
        availableArmor={availableArmor}
        classAbilities={classAbilities}
        allAbilityOptions={allAbilityOptions}
        themeAbilities={themeAbilities}
        weaponProficiencies={weaponProficiencies}
        hasClass={hasClass}
        hasTheme={hasTheme}
        isSpellcaster={isSpellcaster}
        classId={classId}
        knownSpells={knownSpells}
        spellCatalog={spellCatalog}
        spellsKnownLimits={spellsKnownLimits}
        characterSpellSlots={characterSpellSlots}
        spellsPerDay={spellsPerDay}
        descriptions={descriptions}
        savedDescriptionValues={savedDescriptionValues}
        mechanicCharacterId={mechanicCharacterId}
        mechanicName={mechanicName}
        mechanicIntScore={mechanicIntScore}
        pickerOptions={pickerOptions}
        allConditions={allConditions}
      />
    </CharacterProvider>
  );
}

type SheetProps = {
  allSkills: SkillWithClassFlag[];
  skillRanksPerLevel: number;
  allWeapons: Weapon[];
  allEquipment: Equipment[];
  availableArmor: Armor[];
  classAbilities: ClassAbility[];
  allAbilityOptions: ClassAbilityOption[];
  themeAbilities: ThemeAbility[];
  weaponProficiencies: WeaponCategory[];
  hasClass: boolean;
  hasTheme: boolean;
  isSpellcaster: boolean;
  classId: string | null;
  knownSpells: CharacterSpellWithSpell[];
  spellCatalog: Record<number, Spell[]>;
  spellsKnownLimits: Record<number, number>;
  characterSpellSlots: CharacterSpellSlot[];
  spellsPerDay: Record<number, number>;
  descriptions: RaceDescription[];
  savedDescriptionValues: Record<string, string>;
  mechanicCharacterId: string | null;
  mechanicName: string | null;
  mechanicIntScore: number | null;
  pickerOptions: MechanicPickerEntry[];
  allConditions: Condition[];
};

function PillTabs({
  tabs,
  active,
  onSelect,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="flex gap-1 mb-5"
      style={{ backgroundColor: "var(--surface-2)", padding: 4, borderRadius: 11, display: "inline-flex" }}
    >
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className="transition-all"
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 600,
            fontSize: 13,
            padding: "5px 14px",
            borderRadius: 8,
            color: active === id ? "var(--text-1)" : "var(--text-2)",
            backgroundColor: active === id ? "var(--surface)" : "transparent",
            boxShadow: active === id ? "var(--sh-xs)" : "none",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function CharacterSheet({
  allSkills,
  skillRanksPerLevel,
  allWeapons,
  allEquipment,
  availableArmor,
  classAbilities,
  allAbilityOptions,
  themeAbilities,
  weaponProficiencies,
  hasClass,
  hasTheme,
  isSpellcaster,
  classId,
  knownSpells,
  spellCatalog,
  spellsKnownLimits,
  characterSpellSlots,
  spellsPerDay,
  descriptions,
  savedDescriptionValues,
  mechanicCharacterId,
  mechanicName,
  mechanicIntScore,
  pickerOptions,
  allConditions,
}: SheetProps) {
  const { isOwner, raceType, mechanicLevel, level, skills, carriedWeapons, scores, healthValues, combatMods } = useCharacter();
  const [desktopTab, setDesktopTab] = useState("stats");

  const dexMod = modifier(scores.dexScore);
  const conMod = modifier(scores.conScore);
  const wisMod = modifier(scores.wisScore);
  const fortTotal = combatMods.fortBaseSave + conMod + combatMods.fortMiscMod;
  const refTotal = combatMods.refBaseSave + dexMod + combatMods.refMiscMod;
  const willTotal = combatMods.willBaseSave + wisMod + combatMods.willMiscMod;
  const fmt = (n: number) => n >= 0 ? `+${n}` : `${n}`;

  const hpSummary = `${healthValues.staminaPointsCurrent}/${healthValues.staminaPointsTotal} SP · ${healthValues.hitPointsCurrent}/${healthValues.hitPointsTotal} HP`;
  const abilitySummary = `STR ${scores.strScore} / DEX ${scores.dexScore} / INT ${scores.intScore}`;
  const saveSummary = `Fort ${fmt(fortTotal)} / Ref ${fmt(refTotal)} / Will ${fmt(willTotal)}`;
  void combatMods.baseAttackBonus;
  const weaponSummary = carriedWeapons.length > 0 ? `${carriedWeapons.length} item${carriedWeapons.length !== 1 ? "s" : ""}` : "empty";

  const desktopTabs = [
    { id: "stats", label: "Stats" },
    { id: "abilities-gear", label: "Abilities & Gear" },
    ...(isSpellcaster ? [{ id: "spells", label: "Spells" }] : []),
  ];

  const levelControl = isOwner ? <LevelControl /> : (
    <p className="text-sm" style={{ color: "var(--text-2)" }}>
      <span style={{ color: "var(--text-1)", fontWeight: 500 }}>Level</span> {level}
    </p>
  );

  const weaponsBlock = (
    <div>
      {carriedWeapons.length === 0 ? (
        <p className="text-sm mb-3" style={{ color: "var(--text-2)" }}>No weapons in inventory.</p>
      ) : (
        <div className="flex flex-col gap-3 mb-3">
          {carriedWeapons.map((weapon) => (
            <WeaponCard key={weapon.id} weapon={weapon} />
          ))}
        </div>
      )}
      {isOwner && <WeaponPicker allWeapons={allWeapons} />}
    </div>
  );

  return (
    <>
      {/* ── Mobile layout (< md) ── */}
      <div className="md:hidden px-3 pt-3">
        <div className="mb-4">{levelControl}</div>

        {raceType === "drone" && (
          <AccordionBlock icon={<Wrench size={16} />} title="Mechanic Link">
            <MechanicPanel
              isOwner={isOwner}
              mechanicCharacterId={mechanicCharacterId}
              mechanicName={mechanicName}
              mechanicLevel={mechanicLevel}
              mechanicIntScore={mechanicIntScore}
              pickerOptions={pickerOptions}
            />
          </AccordionBlock>
        )}

        <AccordionBlock icon={<Heart size={16} />} title={raceType === "drone" ? "Hit Points" : "Health & Resolve"} summary={hpSummary} defaultOpen>
          <HealthResolveSection />
          <ConditionsSection allConditions={allConditions} />
        </AccordionBlock>

        <AccordionBlock icon={<Zap size={16} />} title="Ability Scores" summary={abilitySummary}>
          <AbilityScoresSection />
        </AccordionBlock>

        <AccordionBlock icon={<List size={16} />} title="Skills" summary={`${skills.length} skills`}>
          <SkillsSection allSkills={allSkills} skillRanksPerLevel={skillRanksPerLevel} />
        </AccordionBlock>

        <AccordionBlock icon={<Shield size={16} />} title="Combat Stats" summary={saveSummary}>
          <CombatStatsSection />
        </AccordionBlock>

        <AccordionBlock icon={<Sword size={16} />} title="Weapons & Gear" summary={weaponSummary}>
          {weaponsBlock}
        </AccordionBlock>

        {isSpellcaster && classId && (
          <AccordionBlock icon={<Sparkles size={16} />} title="Spells" summary="—">
            <SpellsSection
              classId={classId}
              knownSpells={knownSpells}
              spellCatalog={spellCatalog}
              spellsKnownLimits={spellsKnownLimits}
              characterSpellSlots={characterSpellSlots}
              spellsPerDay={spellsPerDay}
            />
          </AccordionBlock>
        )}

        {descriptions.length > 0 && (
          <AccordionBlock icon={<User size={16} />} title="Description">
            <DescriptionSection descriptions={descriptions} savedValues={savedDescriptionValues} />
          </AccordionBlock>
        )}

        <AccordionBlock icon={<BookOpen size={16} />} title="Abilities & Gear">
          {hasClass && (
            <ClassFeaturesSection
              classAbilities={classAbilities}
              allAbilityOptions={allAbilityOptions}

              weaponProficiencies={weaponProficiencies}
            />
          )}
          {hasTheme && <ThemeFeaturesSection themeAbilities={themeAbilities} characterLevel={level} />}
          <FeatsSection />
          <CharacterNotesSection type="ability" title="Abilities" />
          <CharacterNotesSection type="proficiency" title="Proficiencies" />
          <CharacterNotesSection type="note" title="Notes" />
        </AccordionBlock>

        <AccordionBlock icon={<Star size={16} />} title="Inventory">
          <CreditsXpSection />
          <ArmorInventory availableArmor={availableArmor} />
          <EquipmentInventory allEquipment={allEquipment} />
        </AccordionBlock>

        <AccordionBlock icon={<Languages size={16} />} title="Languages">
          <LanguagesSection />
        </AccordionBlock>
      </div>

      {/* ── Desktop layout (≥ md) ── */}
      <div className="hidden md:block p-6">
        <div className="mb-5">{levelControl}</div>
        <PillTabs tabs={desktopTabs} active={desktopTab} onSelect={setDesktopTab} />

        {desktopTab === "stats" && (
          <div className="grid gap-6" style={{ gridTemplateColumns: "1.1fr 1fr" }}>
            <div>
              {raceType === "drone" && (
                <MechanicPanel
                  isOwner={isOwner}
                  mechanicCharacterId={mechanicCharacterId}
                  mechanicName={mechanicName}
                  mechanicLevel={mechanicLevel}
                  mechanicIntScore={mechanicIntScore}
                  pickerOptions={pickerOptions}
                />
              )}
              <AccordionBlock icon={<Zap size={16} />} title="Ability Scores" summary={abilitySummary} defaultOpen>
                <AbilityScoresSection />
              </AccordionBlock>
              <AccordionBlock icon={<List size={16} />} title="Skills" summary={`${skills.length} skills`} defaultOpen>
                <SkillsSection allSkills={allSkills} skillRanksPerLevel={skillRanksPerLevel} />
              </AccordionBlock>
            </div>
            <div>
              <AccordionBlock icon={<Heart size={16} />} title={raceType === "drone" ? "Hit Points" : "Health & Resolve"} summary={hpSummary} defaultOpen>
                <HealthResolveSection />
                <ConditionsSection allConditions={allConditions} />
              </AccordionBlock>
              <AccordionBlock icon={<Shield size={16} />} title="Combat Stats" summary={saveSummary} defaultOpen>
                <CombatStatsSection />
              </AccordionBlock>
              <AccordionBlock icon={<Sword size={16} />} title="Weapons & Gear" summary={weaponSummary} defaultOpen>
                {weaponsBlock}
              </AccordionBlock>
            </div>
          </div>
        )}

        {desktopTab === "abilities-gear" && (
          <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div>
              {hasClass && (
                <ClassFeaturesSection
                  classAbilities={classAbilities}
                  allAbilityOptions={allAbilityOptions}
    
                  weaponProficiencies={weaponProficiencies}
                />
              )}
              {hasTheme && <ThemeFeaturesSection themeAbilities={themeAbilities} characterLevel={level} />}
              <FeatsSection />
              <CharacterNotesSection type="ability" title="Abilities" />
              <CharacterNotesSection type="proficiency" title="Proficiencies" />
              <LanguagesSection />
            </div>
            <div>
              <CreditsXpSection />
              <ArmorInventory availableArmor={availableArmor} />
              <EquipmentInventory allEquipment={allEquipment} />
              <CharacterNotesSection type="note" title="Notes" />
              {descriptions.length > 0 && (
                <DescriptionSection descriptions={descriptions} savedValues={savedDescriptionValues} />
              )}
            </div>
          </div>
        )}

        {desktopTab === "spells" && isSpellcaster && classId && (
          <div className="max-w-[600px]">
            <SpellsSection
              classId={classId}
              knownSpells={knownSpells}
              spellCatalog={spellCatalog}
              spellsKnownLimits={spellsKnownLimits}
              characterSpellSlots={characterSpellSlots}
              spellsPerDay={spellsPerDay}
            />
          </div>
        )}
      </div>
    </>
  );
}
