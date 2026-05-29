import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { canViewCharacter, isCharacterOwner } from "@/lib/authorization";
import { getCharacterWithCampaigns } from "@/db/queries/characters";
import CharacterActions from "./_components/character-actions";
import JoinCampaignForm from "./_components/join-campaign-form";

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

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{character.name}</h1>
        {isOwner && <CharacterActions characterId={id} />}
      </div>

      <p className="mb-8 text-sm text-muted-foreground">
        Created {new Date(character.createdAt).toLocaleDateString()}
      </p>

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
