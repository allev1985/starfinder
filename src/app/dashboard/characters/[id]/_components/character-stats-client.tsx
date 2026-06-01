"use client";

import { useState } from "react";
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
import type { AbilityScores, CharacterFeatWithName, CharacterArmorEntry, CharacterEquipmentEntry, MechanicPickerEntry } from "@/db/queries/characters";
import type { SkillWithClassFlag } from "@/db/queries/reference";
import type { Armor, Weapon, Equipment, CharacterSkill, RaceType, ClassAbility, ClassAbilityOption, ThemeAbility, CharacterClassChoice, WeaponCategory, CharacterSpell, Spell, RaceDescription } from "@/db/schema";

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
}: Props) {
  const [scores, setScores] = useState<AbilityScores>(initialScores);
  const [level, setLevel] = useState(initialLevel);
  const [currentArmor, setCurrentArmor] = useState<Armor | null>(initialEquippedArmor);
  const [carriedWeapons, setCarriedWeapons] = useState<Weapon[]>(initialCarriedWeapons);

  function handleWeaponAdded(weapon: Weapon) {
    setCarriedWeapons((prev) => [...prev, weapon]);
  }

  function handleWeaponRemoved(weaponId: string) {
    setCarriedWeapons((prev) => prev.filter((w) => w.id !== weaponId));
  }

  const carriedWeaponIds = new Set(carriedWeapons.map((w) => w.id));

  return (
    <>
      {isOwner ? (
        <div className="mb-6">
          <LevelControl
            characterId={characterId}
            initialLevel={initialLevel}
            onLevelChange={setLevel}
          />
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
                  characterId={characterId}
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
                  characterId={characterId}
                  descriptions={descriptions}
                  savedValues={savedDescriptionValues}
                  isOwner={isOwner}
                />
              )}
              <AbilityScoresSection
                characterId={characterId}
                scores={scores}
                raceType={raceType}
                isOwner={isOwner}
                onScoreChange={setScores}
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
            </div>
            <div>
              <HealthResolveSection
                characterId={characterId}
                isOwner={isOwner}
                raceType={raceType}
                staminaPointsTotal={staminaPointsTotal}
                staminaPointsCurrent={staminaPointsCurrent}
                hitPointsTotal={hitPointsTotal}
                hitPointsCurrent={hitPointsCurrent}
                resolvePointsTotal={resolvePointsTotal}
                resolvePointsCurrent={resolvePointsCurrent}
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
                        characterId={characterId}
                        isOwner={isOwner}
                        onWeaponRemoved={handleWeaponRemoved}
                      />
                    ))}
                  </div>
                )}
                {isOwner && (
                  <WeaponPicker
                    allWeapons={allWeapons}
                    carriedWeaponIds={carriedWeaponIds}
                    characterId={characterId}
                    onWeaponAdded={handleWeaponAdded}
                  />
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
                  characterId={characterId}
                  characterLevel={level}
                  classAbilities={classAbilities}
                  allAbilityOptions={allAbilityOptions}
                  savedChoices={savedChoices}
                  weaponProficiencies={weaponProficiencies}
                  isOwner={isOwner}
                />
              )}
              {hasTheme && (
                <ThemeFeaturesSection
                  themeAbilities={themeAbilities}
                  characterLevel={level}
                />
              )}
              <FeatsSection
                characterId={characterId}
                initialFeats={initialFeats}
                isOwner={isOwner}
              />
            </div>
            <div>
              <ArmorInventory
                characterId={characterId}
                isOwner={isOwner}
                initialCharacterArmor={initialCharacterArmor}
                availableArmor={availableArmor}
                onWornArmorChange={setCurrentArmor}
              />
              <EquipmentInventory
                characterId={characterId}
                isOwner={isOwner}
                allEquipment={allEquipment}
                initialCharacterEquipment={initialCharacterEquipment}
              />
            </div>
          </div>
        </TabsContent>

        {isSpellcaster && classId && (
          <TabsContent value="spells">
            <div className="mt-4">
              <SpellsSection
                characterId={characterId}
                classId={classId}
                isOwner={isOwner}
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
