import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getCampaignWithCharacters } from "@/db/queries/campaigns";
import { getSessionWithEntries, loadSessionNoteContentAction } from "../actions";
import SessionDetailClient from "./_session-detail-client";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const { id, sessionId } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const [{ campaign, characters }, { session }, content] = await Promise.all([
    getCampaignWithCharacters(id),
    getSessionWithEntries(sessionId),
    loadSessionNoteContentAction(id, sessionId),
  ]);

  if (!campaign) redirect("/dashboard/campaigns");
  if (!session) redirect(`/dashboard/campaigns/${id}/sessions`);

  const isGm = campaign.gmId === user.id;

  return (
    <SessionDetailClient
      campaignId={id}
      session={session}
      characters={characters}
      initialContent={content}
      isGm={isGm}
    />
  );
}
