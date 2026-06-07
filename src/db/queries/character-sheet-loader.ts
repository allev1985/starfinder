import "server-only";
import type { CharacterWithMeta } from "@/db/queries/characters";
import {
  getCharacterDescriptionValues,
  getCharacterCombatStats,
  getCharacterSkills,
  getCharactersForMechanicPicker,
  getCharacterArmor,
  getCharacterEquipment,
  getCharacterClassChoices,
  getCharacterFeats,
  getCharacterNotes,
} from "@/db/queries/characters";
import {
  getDescriptionsForType,
  getAllSkillsWithClassFlag,
  getArmorForClass,
  getAllEquipment,
  getClassAbilities,
  getAllClassAbilityOptions,
  getThemeAbilities,
  getWeaponProficienciesForClass,
} from "@/db/queries/reference";
import { getAllWeapons, getCharacterWeapons } from "@/db/queries/weapons";
import {
  getCharacterSpells,
  getSpellsByClassAndLevel,
  getSpellsKnownLimits,
  getCharacterSpellSlots,
  getSpellsPerDay,
} from "@/db/queries/spells";

export async function loadCharacterSheetData(
  characterId: string,
  character: CharacterWithMeta
) {
  const [
    descriptions,
    savedDescriptionValues,
    combatStats,
    characterSkills,
    allSkills,
    mechanicPickerOptions,
    availableArmor,
    characterArmorInventory,
    allWeapons,
    carriedWeapons,
    allEquipment,
    characterEquipmentInventory,
  ] = character.raceType
    ? await Promise.all([
        getDescriptionsForType(character.raceType),
        getCharacterDescriptionValues(characterId),
        getCharacterCombatStats(characterId),
        getCharacterSkills(characterId),
        getAllSkillsWithClassFlag(character.classId ?? null),
        character.raceType === "drone"
          ? getCharactersForMechanicPicker(characterId)
          : Promise.resolve(
              [] as Awaited<ReturnType<typeof getCharactersForMechanicPicker>>
            ),
        getArmorForClass(character.classId ?? null),
        getCharacterArmor(characterId),
        getAllWeapons(),
        getCharacterWeapons(characterId),
        getAllEquipment(),
        getCharacterEquipment(characterId),
      ])
    : await Promise.all([
        Promise.resolve(
          [] as Awaited<ReturnType<typeof getDescriptionsForType>>
        ),
        Promise.resolve(
          [] as Awaited<ReturnType<typeof getCharacterDescriptionValues>>
        ),
        getCharacterCombatStats(characterId),
        getCharacterSkills(characterId),
        getAllSkillsWithClassFlag(character.classId ?? null),
        Promise.resolve([]),
        getArmorForClass(character.classId ?? null),
        getCharacterArmor(characterId),
        getAllWeapons(),
        getCharacterWeapons(characterId),
        getAllEquipment(),
        getCharacterEquipment(characterId),
      ]);

  const savedValuesMap = Object.fromEntries(
    savedDescriptionValues.map((v) => [v.descriptionId, v.value])
  );

  const [characterKnownSpells, spellCatalog, spellsKnownLimits, characterSpellSlotRows, spellsPerDay] =
    character.isSpellcaster && character.classId
      ? await Promise.all([
          getCharacterSpells(characterId),
          Promise.all(
            [0, 1, 2, 3, 4, 5, 6].map((lvl) =>
              getSpellsByClassAndLevel(character.classId!, lvl).then(
                (spells) => [lvl, spells] as const
              )
            )
          ).then((entries) => Object.fromEntries(entries)),
          getSpellsKnownLimits(character.classId, character.level),
          getCharacterSpellSlots(characterId),
          getSpellsPerDay(character.classId, character.level),
        ])
      : ([[], {}, {}, [], {}] as [
          Awaited<ReturnType<typeof getCharacterSpells>>,
          Record<number, Awaited<ReturnType<typeof getSpellsByClassAndLevel>>>,
          Record<number, number>,
          Awaited<ReturnType<typeof getCharacterSpellSlots>>,
          Record<number, number>,
        ]);

  const [
    classFeatureAbilities,
    classAbilityOptionsList,
    themeFeatureAbilities,
    weaponProficiencies,
    classChoices,
    characterFeatsList,
    characterNotesList,
  ] = await Promise.all([
    character.classId
      ? getClassAbilities(character.classId)
      : Promise.resolve([]),
    character.classId
      ? getAllClassAbilityOptions(character.classId)
      : Promise.resolve([]),
    character.themeId
      ? getThemeAbilities(character.themeId)
      : Promise.resolve([]),
    character.classId
      ? getWeaponProficienciesForClass(character.classId)
      : Promise.resolve([]),
    getCharacterClassChoices(characterId),
    getCharacterFeats(characterId),
    getCharacterNotes(characterId),
  ]);

  return {
    descriptions,
    savedValuesMap,
    combatStats,
    characterSkills,
    allSkills,
    mechanicPickerOptions,
    availableArmor,
    characterArmorInventory,
    allWeapons,
    carriedWeapons,
    allEquipment,
    characterEquipmentInventory,
    characterKnownSpells,
    spellCatalog,
    spellsKnownLimits,
    characterSpellSlotRows,
    spellsPerDay,
    classFeatureAbilities,
    classAbilityOptionsList,
    themeFeatureAbilities,
    weaponProficiencies,
    classChoices,
    characterFeatsList,
    characterNotesList,
  };
}
