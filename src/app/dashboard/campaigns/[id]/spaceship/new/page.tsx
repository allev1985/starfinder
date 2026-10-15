import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import CreateSpaceshipForm from "../_create-form";

export default async function NewSpaceshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add Ship</h1>
      </div>
      <CreateSpaceshipForm campaignId={id} />
    </div>
  );
}
