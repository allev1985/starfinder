import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { isCampaignParticipant } from "@/lib/authorization";
import { getCampaignWithCharacters } from "@/db/queries/campaigns";
import { Badge } from "@/components/ui/badge";
import CampaignActions from "./_components/campaign-actions";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const allowed = await isCampaignParticipant(id, user.id);
  if (!allowed) redirect("/dashboard/campaigns");

  const { campaign, characters } = await getCampaignWithCharacters(id);
  if (!campaign) redirect("/dashboard/campaigns");

  const isDm = campaign.dmId === user.id;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{campaign.name}</h1>
          {isDm && <Badge>DM</Badge>}
        </div>
        {isDm && <CampaignActions campaignId={id} />}
      </div>

      {isDm && (
        <p className="mb-6 text-sm text-muted-foreground">
          Join code:{" "}
          <span className="font-mono font-medium text-foreground">
            {campaign.joinCode}
          </span>
        </p>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Characters
      </h2>

      {characters.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No characters have joined yet. Share the join code to invite players.
        </p>
      ) : (
        <ul className="flex flex-col divide-y">
          {characters.map((character) => (
            <li key={character.id}>
              <Link
                href={`/dashboard/campaigns/${id}/characters/${character.id}`}
                className="block py-3 text-sm font-medium hover:text-foreground/80"
              >
                {character.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
