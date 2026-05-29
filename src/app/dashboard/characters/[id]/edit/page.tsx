import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { isCharacterOwner } from "@/lib/authorization";
import { getCharacterWithCampaigns } from "@/db/queries/characters";
import EditCharacterForm from "./_edit-form";

export default async function EditCharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const owned = await isCharacterOwner(id, user.id);
  if (!owned) redirect(`/dashboard/characters/${id}`);

  const { character } = await getCharacterWithCampaigns(id);
  if (!character) redirect("/dashboard/characters");

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Edit Character</h1>
      <EditCharacterForm character={character} />
    </div>
  );
}
