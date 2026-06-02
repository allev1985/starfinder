import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { isCampaignParticipant } from "@/lib/authorization";
import { getCampaignWithCharacters } from "@/db/queries/campaigns";
import CampaignSidebar from "./_components/campaign-sidebar";

export default async function CampaignLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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
    <div className="flex flex-1">
      <CampaignSidebar
        campaignId={id}
        campaignName={campaign.name}
        isDm={isDm}
        joinCode={campaign.joinCode}
        characters={characters}
      />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
