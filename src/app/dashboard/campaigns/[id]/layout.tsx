import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { isCampaignParticipant } from "@/lib/authorization";
import { getCampaignWithCharacters, getSpaceshipsByCampaign } from "@/db/queries/campaigns";
import CampaignSidebar from "./_components/campaign-sidebar";
import CampaignContextSetter from "./_components/campaign-context-setter";

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

  const [{ campaign, characters }, spaceships] = await Promise.all([
    getCampaignWithCharacters(id),
    getSpaceshipsByCampaign(id),
  ]);
  if (!campaign) redirect("/dashboard/campaigns");

  const isGm = campaign.gmId === user.id;

  return (
    <div className="flex flex-1 min-h-0">
      <CampaignContextSetter
        campaignId={id}
        hasSpaceships={spaceships.length > 0}
      />
      <CampaignSidebar
        campaignId={id}
        campaignName={campaign.name}
        isGm={isGm}
        joinCode={campaign.joinCode}
        characters={characters}
        spaceships={spaceships}
      />
      <div className="flex-1 min-h-0 overflow-y-auto pb-[68px] md:pb-0">{children}</div>
    </div>
  );
}
