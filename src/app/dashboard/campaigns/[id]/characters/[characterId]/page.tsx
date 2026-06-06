import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { isCampaignParticipant, isCharacterOwner } from "@/lib/authorization";
import { getCharacterWithCampaigns } from "@/db/queries/characters";
import { loadCharacterSheetData } from "@/db/queries/character-sheet-loader";
import CharacterStatsClient from "@/app/dashboard/characters/[id]/_components/character-stats-client";

export default async function CampaignCharacterPage({
  params,
}: {
  params: Promise<{ id: string; characterId: string }>;
}) {
  const { id, characterId } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const allowed = await isCampaignParticipant(id, user.id);
  if (!allowed) redirect("/dashboard/campaigns");

  const { character, campaigns } = await getCharacterWithCampaigns(characterId);
  if (!character || !campaigns.some((c) => c.id === id)) {
    redirect(`/dashboard/campaigns/${id}`);
  }

  const [ownerFlag, sheetData] = await Promise.all([
    isCharacterOwner(characterId, user.id),
    loadCharacterSheetData(characterId, character),
  ]);

  const {
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
  } = sheetData;

  return (
    <div className="p-6">
      <div className="mb-1 text-sm" style={{ color: "var(--text-3)" }}>
        <Link href={`/dashboard/campaigns/${id}`} className="hover:underline" style={{ color: "var(--text-2)" }}>
          {campaigns.find((c) => c.id === id)?.name ?? "Campaign"}
        </Link>
        {" / "}
        {character.name}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{character.name}</h1>
      </div>

      <div className="mb-6 flex gap-6 text-sm text-muted-foreground">
        <span><span className="font-medium text-foreground">Race</span> {character.raceName ?? "—"}</span>
        {character.raceType === "drone" && character.chassisName && (
          <span><span className="font-medium text-foreground">Chassis</span> {character.chassisName}</span>
        )}
        <span><span className="font-medium text-foreground">Class</span> {character.className ?? "—"}</span>
        <span><span className="font-medium text-foreground">Theme</span> {character.themeName ?? "—"}</span>
      </div>

      <CharacterStatsClient
        characterId={characterId}
        characterName={character.name}
        raceName={character.raceName ?? null}
        characterClassName={character.className ?? null}
        themeName={character.themeName ?? null}
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
        isOwner={ownerFlag}
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
        characterSpellSlots={characterSpellSlotRows}
        spellsPerDay={spellsPerDay}
        descriptions={descriptions}
        savedDescriptionValues={savedValuesMap}
        mechanicCharacterId={character.mechanicCharacterId ?? null}
        mechanicName={character.mechanicName}
        mechanicIntScore={character.mechanicIntScore}
        pickerOptions={mechanicPickerOptions}
        initialCredits={character.credits}
        initialXpEarned={character.xpEarned}
        initialLanguages={character.languages}
      />
    </div>
  );
}
