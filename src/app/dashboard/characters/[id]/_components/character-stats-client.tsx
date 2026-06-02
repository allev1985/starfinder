"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { CharacterProvider, useCharacter } from "./character-context";
import type { CharacterFeatWithName, CharacterArmorEntry, CharacterEquipmentEntry, MechanicPickerEntry, HealthResolveValues } from "@/db/queries/characters";
import type { AbilityScores } from "@/db/queries/characters";
import type { SkillWithClassFlag } from "@/db/queries/reference";
import type { Armor, Weapon, Equipment, CharacterSkill, RaceType, ClassAbility, ClassAbilityOption, ThemeAbility, CharacterClassChoice, WeaponCategory, CharacterSpell, Spell, RaceDescription } from "@/db/schema";
import type { CombatMods } from "./character-context";

type CharacterSpellWithSpell = CharacterSpell & { spell: Spell };

type Props = {
  characterId: string;
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
  savedChoices: CharacterClassChoice[];
  initialFeats: CharacterFeatWithName[];
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
  descriptions: RaceDescription[];
  savedDescriptionValues: Record<string, string>;
  mechanicCharacterId: string | null;
  mechanicName: string | null;
  mechanicIntScore: number | null;
  pickerOptions: MechanicPickerEntry[];
  initialCredits: number;
  initialXpEarned: number;
  initialLanguages: string[];
};

export default function CharacterStatsClient({
  characterId,
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
  savedChoices,
  initialFeats,
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
  descriptions,
  savedDescriptionValues,
  mechanicCharacterId,
  mechanicName,
  mechanicIntScore,
  pickerOptions,
  initialCredits,
  initialXpEarned,
  initialLanguages,
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
      initialFeats={initialFeats}
      initialLanguages={initialLanguages}
      initialCredits={initialCredits}
      initialXpEarned={initialXpEarned}
      initialHealthValues={initialHealthValues}
      initialCombatMods={initialCombatMods}
    >
      <CharacterSheet
        initialSkills={initialSkills}
        allSkills={allSkills}
        skillRanksPerLevel={skillRanksPerLevel}
        allWeapons={allWeapons}
        allEquipment={allEquipment}
        availableArmor={availableArmor}
        classAbilities={classAbilities}
        allAbilityOptions={allAbilityOptions}
        themeAbilities={themeAbilities}
        weaponProficiencies={weaponProficiencies}
        savedChoices={savedChoices}
        hasClass={hasClass}
        hasTheme={hasTheme}
        isSpellcaster={isSpellcaster}
        classId={classId}
        knownSpells={knownSpells}
        spellCatalog={spellCatalog}
        spellsKnownLimits={spellsKnownLimits}
        descriptions={descriptions}
        savedDescriptionValues={savedDescriptionValues}
        mechanicCharacterId={mechanicCharacterId}
        mechanicName={mechanicName}
        mechanicIntScore={mechanicIntScore}
        pickerOptions={pickerOptions}
      />
    </CharacterProvider>
  );
}

type SheetProps = {
  initialSkills: CharacterSkill[];
  allSkills: SkillWithClassFlag[];
  skillRanksPerLevel: number;
  allWeapons: Weapon[];
  allEquipment: Equipment[];
  availableArmor: Armor[];
  classAbilities: ClassAbility[];
  allAbilityOptions: ClassAbilityOption[];
  themeAbilities: ThemeAbility[];
  weaponProficiencies: WeaponCategory[];
  savedChoices: CharacterClassChoice[];
  hasClass: boolean;
  hasTheme: boolean;
  isSpellcaster: boolean;
  classId: string | null;
  knownSpells: CharacterSpellWithSpell[];
  spellCatalog: Record<number, Spell[]>;
  spellsKnownLimits: Record<number, number>;
  descriptions: RaceDescription[];
  savedDescriptionValues: Record<string, string>;
  mechanicCharacterId: string | null;
  mechanicName: string | null;
  mechanicIntScore: number | null;
  pickerOptions: MechanicPickerEntry[];
};

function CharacterSheet({
  initialSkills,
  allSkills,
  skillRanksPerLevel,
  allWeapons,
  allEquipment,
  availableArmor,
  classAbilities,
  allAbilityOptions,
  themeAbilities,
  weaponProficiencies,
  savedChoices,
  hasClass,
  hasTheme,
  isSpellcaster,
  classId,
  knownSpells,
  spellCatalog,
  spellsKnownLimits,
  descriptions,
  savedDescriptionValues,
  mechanicCharacterId,
  mechanicName,
  mechanicIntScore,
  pickerOptions,
}: SheetProps) {
  const { isOwner, raceType, mechanicLevel, level, carriedWeapons } = useCharacter();

  return (
    <>
      {isOwner ? (
        <div className="mb-6">
          <LevelControl />
        </div>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Level</span> {level}
        </p>
      )}

      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="abilities-gear">Abilities &amp; Gear</TabsTrigger>
          {isSpellcaster && <TabsTrigger value="spells">Spells</TabsTrigger>}
        </TabsList>

        <TabsContent value="stats">
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
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
              {descriptions.length > 0 && (
                <DescriptionSection
                  descriptions={descriptions}
                  savedValues={savedDescriptionValues}
                />
              )}
              <AbilityScoresSection />
              <SkillsSection
                initialSkills={initialSkills}
                allSkills={allSkills}
                skillRanksPerLevel={skillRanksPerLevel}
              />
            </div>
            <div>
              <HealthResolveSection />
              <CombatStatsSection />
              <section className="mb-8">
                <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                  Weapons
                </h2>
                {carriedWeapons.length === 0 ? (
                  <p className="mb-3 text-sm text-muted-foreground">No weapons in inventory.</p>
                ) : (
                  <div className="mb-3 flex flex-col gap-3">
                    {carriedWeapons.map((weapon) => (
                      <WeaponCard
                        key={weapon.id}
                        weapon={weapon}
                      />
                    ))}
                  </div>
                )}
                {isOwner && (
                  <WeaponPicker allWeapons={allWeapons} />
                )}
              </section>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="abilities-gear">
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              {hasClass && (
                <ClassFeaturesSection
                  classAbilities={classAbilities}
                  allAbilityOptions={allAbilityOptions}
                  savedChoices={savedChoices}
                  weaponProficiencies={weaponProficiencies}
                />
              )}
              {hasTheme && (
                <ThemeFeaturesSection
                  themeAbilities={themeAbilities}
                  characterLevel={level}
                />
              )}
              <FeatsSection />
              <LanguagesSection />
            </div>
            <div>
              <CreditsXpSection />
              <ArmorInventory
                availableArmor={availableArmor}
              />
              <EquipmentInventory
                allEquipment={allEquipment}
              />
            </div>
          </div>
        </TabsContent>

        {isSpellcaster && classId && (
          <TabsContent value="spells">
            <div className="mt-4">
              <SpellsSection
                classId={classId}
                knownSpells={knownSpells}
                spellCatalog={spellCatalog}
                spellsKnownLimits={spellsKnownLimits}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </>
  );
}
