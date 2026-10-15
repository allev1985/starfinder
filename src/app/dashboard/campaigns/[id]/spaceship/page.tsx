import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getSpaceshipsByCampaign } from "@/db/queries/campaigns";
import CreateSpaceshipForm from "./_create-form";

export default async function SpaceshipRootPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const ships = await getSpaceshipsByCampaign(id);
  if (ships.length > 0) {
    redirect(`/dashboard/campaigns/${id}/spaceship/${ships[0].id}`);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Spaceships</h1>
      </div>
      <CreateSpaceshipForm campaignId={id} />
    </div>
  );
}
