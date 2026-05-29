import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { isCampaignDm } from "@/lib/authorization";
import { getCampaignWithCharacters } from "@/db/queries/campaigns";
import EditCampaignForm from "./_edit-form";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const isDm = await isCampaignDm(id, user.id);
  if (!isDm) redirect(`/dashboard/campaigns/${id}`);

  const { campaign } = await getCampaignWithCharacters(id);
  if (!campaign) redirect("/dashboard/campaigns");

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Edit Campaign</h1>
      <EditCampaignForm campaign={campaign} />
    </div>
  );
}
