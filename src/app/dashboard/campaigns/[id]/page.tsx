import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
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

  const { campaign } = await getCampaignWithCharacters(id);
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
        <p className="text-sm text-muted-foreground">
          Join code:{" "}
          <span className="font-mono font-medium text-foreground">
            {campaign.joinCode}
          </span>
        </p>
      )}
    </div>
  );
}
