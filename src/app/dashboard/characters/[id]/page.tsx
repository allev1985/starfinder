import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { canViewCharacter, isCharacterOwner } from "@/lib/authorization";
import { getCharacterWithCampaigns, getCharacterDescriptionValues, getCharacterCombatStats, getCharacterSkills, getCharactersForMechanicPicker, getCharacterArmor, getCharacterEquipment, getCharacterClassChoices, getCharacterFeats } from "@/db/queries/characters";
import { getDescriptionsForType, getAllSkillsWithClassFlag, getArmorForClass, getAllEquipment, getClassAbilities, getAllClassAbilityOptions, getThemeAbilities, getWeaponProficienciesForClass } from "@/db/queries/reference";
import { getAllWeapons, getCharacterWeapons } from "@/db/queries/weapons";
import { getCharacterSpells, getSpellsByClassAndLevel, getSpellsKnownLimits } from "@/db/queries/spells";
import CharacterActions from "./_components/character-actions";
import JoinCampaignForm from "./_components/join-campaign-form";
import CharacterStatsClient from "./_components/character-stats-client";

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const allowed = await canViewCharacter(id, user.id);
  if (!allowed) redirect("/dashboard/characters");

  const { character, campaigns } = await getCharacterWithCampaigns(id);
  if (!character) redirect("/dashboard/characters");

  const isOwner = await isCharacterOwner(id, user.id);

  const [descriptions, savedDescriptionValues, combatStats, characterSkills, allSkills, mechanicPickerOptions, availableArmor, characterArmorInventory, allWeapons, carriedWeapons, allEquipment, characterEquipmentInventory] =
    character.raceType
      ? await Promise.all([
          getDescriptionsForType(character.raceType),
          getCharacterDescriptionValues(id),
          getCharacterCombatStats(id),
          getCharacterSkills(id),
          getAllSkillsWithClassFlag(character.classId ?? null),
          character.raceType === "drone" ? getCharactersForMechanicPicker(id) : Promise.resolve([] as Awaited<ReturnType<typeof getCharactersForMechanicPicker>>),
          getArmorForClass(character.classId ?? null),
          getCharacterArmor(id),
          getAllWeapons(),
          getCharacterWeapons(id),
          getAllEquipment(),
          getCharacterEquipment(id),
        ])
      : await Promise.all([
          Promise.resolve([] as Awaited<ReturnType<typeof getDescriptionsForType>>),
          Promise.resolve([] as Awaited<ReturnType<typeof getCharacterDescriptionValues>>),
          getCharacterCombatStats(id),
          getCharacterSkills(id),
          getAllSkillsWithClassFlag(character.classId ?? null),
          Promise.resolve([]),
          getArmorForClass(character.classId ?? null),
          getCharacterArmor(id),
          getAllWeapons(),
          getCharacterWeapons(id),
          getAllEquipment(),
          getCharacterEquipment(id),
        ]);

  const savedValuesMap = Object.fromEntries(
    savedDescriptionValues.map((v) => [v.descriptionId, v.value])
  );

  const [characterKnownSpells, spellCatalog, spellsKnownLimits] =
    character.isSpellcaster && character.classId
      ? await Promise.all([
          getCharacterSpells(id),
          Promise.all(
            [0, 1, 2, 3, 4, 5, 6].map((lvl) =>
              getSpellsByClassAndLevel(character.classId!, lvl).then((spells) => [lvl, spells] as const)
            )
          ).then((entries) => Object.fromEntries(entries)),
          getSpellsKnownLimits(character.classId, character.level),
        ])
      : [[], {}, {}] as [Awaited<ReturnType<typeof getCharacterSpells>>, Record<number, Awaited<ReturnType<typeof getSpellsByClassAndLevel>>>, Record<number, number>];

  const [classFeatureAbilities, classAbilityOptionsList, themeFeatureAbilities, weaponProficiencies, classChoices, characterFeatsList] =
    await Promise.all([
      character.classId ? getClassAbilities(character.classId) : Promise.resolve([]),
      character.classId ? getAllClassAbilityOptions(character.classId) : Promise.resolve([]),
      character.themeId ? getThemeAbilities(character.themeId) : Promise.resolve([]),
      character.classId ? getWeaponProficienciesForClass(character.classId) : Promise.resolve([]),
      getCharacterClassChoices(id),
      getCharacterFeats(id),
    ]);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{character.name}</h1>
        {isOwner && <CharacterActions characterId={id} />}
      </div>

      <div className="mb-4 flex gap-6 text-sm text-muted-foreground">
        <span><span className="font-medium text-foreground">Race</span> {character.raceName ?? "—"}</span>
        {character.raceType === "drone" && character.chassisName && (
          <span><span className="font-medium text-foreground">Chassis</span> {character.chassisName}</span>
        )}
        <span><span className="font-medium text-foreground">Class</span> {character.className ?? "—"}</span>
        <span><span className="font-medium text-foreground">Theme</span> {character.themeName ?? "—"}</span>
      </div>

      {campaigns.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-3">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/dashboard/campaigns/${campaign.id}`}
              className="text-sm font-medium hover:text-foreground/80"
            >
              {campaign.name}
            </Link>
          ))}
        </div>
      ) : isOwner ? (
        <div className="mb-6 max-w-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Join a campaign
          </h2>
          <JoinCampaignForm characterId={id} />
        </div>
      ) : null}

      <CharacterStatsClient
        characterId={id}
        raceType={character.raceType}
        mechanicLevel={character.mechanicLevel}
        scores={{
          strScore: character.strScore,
          dexScore: character.dexScore,
          conScore: character.conScore,
          intScore: character.intScore,
          wisScore: character.wisScore,
          chaScore: character.chaScore,
        }}
        initialLevel={character.level}
        initiativeMiscMod={combatStats?.initiativeMiscMod ?? 0}
        baseAttackBonus={combatStats?.baseAttackBonus ?? 0}
        initialEquippedArmor={character.equippedArmor}
        initialCharacterArmor={characterArmorInventory}
        availableArmor={availableArmor}
        eacMiscMod={combatStats?.eacMiscMod ?? 0}
        kacMiscMod={combatStats?.kacMiscMod ?? 0}
        fortBaseSave={combatStats?.fortBaseSave ?? 0}
        fortMiscMod={combatStats?.fortMiscMod ?? 0}
        refBaseSave={combatStats?.refBaseSave ?? 0}
        refMiscMod={combatStats?.refMiscMod ?? 0}
        willBaseSave={combatStats?.willBaseSave ?? 0}
        willMiscMod={combatStats?.willMiscMod ?? 0}
        meleeAttackMiscMod={combatStats?.meleeAttackMiscMod ?? 0}
        rangedAttackMiscMod={combatStats?.rangedAttackMiscMod ?? 0}
        thrownAttackMiscMod={combatStats?.thrownAttackMiscMod ?? 0}
        initialSkills={characterSkills}
        allSkills={allSkills}
        skillRanksPerLevel={character.skillRanksPerLevel}
        allWeapons={allWeapons}
        initialCarriedWeapons={carriedWeapons}
        allEquipment={allEquipment}
        initialCharacterEquipment={characterEquipmentInventory}
        classAbilities={classFeatureAbilities}
        allAbilityOptions={classAbilityOptionsList}
        themeAbilities={themeFeatureAbilities}
        weaponProficiencies={weaponProficiencies}
        savedChoices={classChoices}
        initialFeats={characterFeatsList}
        hasClass={!!character.classId}
        hasTheme={!!character.themeId}
        isOwner={isOwner}
        staminaPointsTotal={combatStats?.staminaPointsTotal ?? 0}
        staminaPointsCurrent={combatStats?.staminaPointsCurrent ?? 0}
        hitPointsTotal={combatStats?.hitPointsTotal ?? 0}
        hitPointsCurrent={combatStats?.hitPointsCurrent ?? 0}
        resolvePointsTotal={combatStats?.resolvePointsTotal ?? 0}
        resolvePointsCurrent={combatStats?.resolvePointsCurrent ?? 0}
        isSpellcaster={character.isSpellcaster}
        classId={character.classId ?? null}
        knownSpells={characterKnownSpells}
        spellCatalog={spellCatalog}
        spellsKnownLimits={spellsKnownLimits}
        descriptions={descriptions}
        savedDescriptionValues={savedValuesMap}
        mechanicCharacterId={character.mechanicCharacterId ?? null}
        mechanicName={character.mechanicName}
        mechanicIntScore={character.mechanicIntScore}
        pickerOptions={mechanicPickerOptions}
      />

    </div>
  );
}
