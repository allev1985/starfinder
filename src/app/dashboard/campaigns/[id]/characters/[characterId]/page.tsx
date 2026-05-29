import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isCampaignParticipant } from "@/lib/authorization";
import { getCharacterById } from "@/db/queries/campaigns";

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string; characterId: string }>;
}) {
  const { id, characterId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const allowed = await isCampaignParticipant(id, user.id);
  if (!allowed) redirect("/dashboard/campaigns");

  const character = await getCharacterById(characterId);
  if (!character) redirect(`/dashboard/campaigns/${id}`);

  return (
    <div className="p-6">
      <div className="mb-1 text-sm text-muted-foreground">
        <Link href={`/dashboard/campaigns/${id}`} className="hover:underline">
          Campaign
        </Link>
        {" / "}
        {character.name}
      </div>
      <h1 className="mb-6 text-2xl font-semibold">{character.name}</h1>
      <p className="text-sm text-muted-foreground">Character sheet coming soon.</p>
    </div>
  );
}
