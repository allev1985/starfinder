import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { canViewCharacter, isCharacterOwner } from "@/lib/authorization";
import { getCharacterWithCampaigns, getCharacterRaceAttributeValues, getCharacterCombatStats } from "@/db/queries/characters";
import { getRaceAttributes } from "@/db/queries/reference";
import CharacterActions from "./_components/character-actions";
import JoinCampaignForm from "./_components/join-campaign-form";
import LevelControl from "./_components/level-control";
import DescriptionSection from "./_components/description-section";
import CharacterStatsClient from "./_components/character-stats-client";
import HealthResolveSection from "./_components/health-resolve-section";

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

  const [descriptionAttributes, savedAttributeValues, combatStats] = character.raceId
    ? await Promise.all([
        getRaceAttributes(character.raceId).then((attrs) =>
          attrs.filter((a) => a.type === "description")
        ),
        getCharacterRaceAttributeValues(id),
        getCharacterCombatStats(id),
      ])
    : await Promise.all([
        Promise.resolve([] as Awaited<ReturnType<typeof getRaceAttributes>>),
        Promise.resolve([] as Awaited<ReturnType<typeof getCharacterRaceAttributeValues>>),
        getCharacterCombatStats(id),
      ]);

  const savedValuesMap = Object.fromEntries(
    savedAttributeValues.map((v) => [v.attributeId, v.value])
  );

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{character.name}</h1>
        {isOwner && <CharacterActions characterId={id} />}
      </div>

      <div className="mb-4 flex gap-6 text-sm text-muted-foreground">
        <span><span className="font-medium text-foreground">Race</span> {character.raceName ?? "—"}</span>
        <span><span className="font-medium text-foreground">Class</span> {character.className ?? "—"}</span>
        <span><span className="font-medium text-foreground">Theme</span> {character.themeName ?? "—"}</span>
      </div>

      <div className="mb-8">
        {isOwner ? (
          <LevelControl characterId={id} initialLevel={character.level} />
        ) : (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Level</span> {character.level}
          </p>
        )}
      </div>

      <p className="mb-8 text-sm text-muted-foreground">
        Created {new Date(character.createdAt).toLocaleDateString()}
      </p>

      <CharacterStatsClient
        characterId={id}
        scores={{
          strScore: character.strScore,
          dexScore: character.dexScore,
          conScore: character.conScore,
          intScore: character.intScore,
          wisScore: character.wisScore,
          chaScore: character.chaScore,
        }}
        initiativeMiscMod={combatStats?.initiativeMiscMod ?? 0}
        isOwner={isOwner}
      />

      <HealthResolveSection
        characterId={id}
        isOwner={isOwner}
        staminaPointsTotal={combatStats?.staminaPointsTotal ?? 0}
        staminaPointsCurrent={combatStats?.staminaPointsCurrent ?? 0}
        hitPointsTotal={combatStats?.hitPointsTotal ?? 0}
        hitPointsCurrent={combatStats?.hitPointsCurrent ?? 0}
        resolvePointsTotal={combatStats?.resolvePointsTotal ?? 0}
        resolvePointsCurrent={combatStats?.resolvePointsCurrent ?? 0}
      />

      {descriptionAttributes.length > 0 && (
        <DescriptionSection
          characterId={id}
          attributes={descriptionAttributes}
          savedValues={savedValuesMap}
          isOwner={isOwner}
        />
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Campaigns
      </h2>

      {campaigns.length === 0 ? (
        <p className="mb-6 text-sm text-muted-foreground">
          Not in any campaigns yet.
        </p>
      ) : (
        <ul className="mb-6 flex flex-col divide-y">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link
                href={`/dashboard/campaigns/${campaign.id}`}
                className="block py-3 text-sm font-medium hover:text-foreground/80"
              >
                {campaign.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isOwner && (
        <div className="max-w-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Join a campaign
          </h2>
          <JoinCampaignForm characterId={id} />
        </div>
      )}
    </div>
  );
}
