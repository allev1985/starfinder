import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getCampaignWithCharacters } from "@/db/queries/campaigns";
import CreateSpaceshipForm from "../_create-form";

export default async function NewSpaceshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const { campaign } = await getCampaignWithCharacters(id);
  const isDm = campaign?.dmId === user.id;
  if (!isDm) redirect(`/dashboard/campaigns/${id}/spaceship`);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add Ship</h1>
      </div>
      <CreateSpaceshipForm campaignId={id} />
    </div>
  );
}
