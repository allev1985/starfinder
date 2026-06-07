import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getCampaignWithCharacters } from "@/db/queries/campaigns";
import { getActiveBattleForCampaign, getBattleCombatants, getBattlePartyMembers } from "@/db/queries/battles";
import InitiativeClient from "./_initiative-client";

export default async function InitiativePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const { campaign } = await getCampaignWithCharacters(id);
  if (!campaign) redirect("/dashboard/campaigns");

  const isGm = campaign.gmId === user.id;
  const [battle, partyMembers] = await Promise.all([
    getActiveBattleForCampaign(id),
    getBattlePartyMembers(id),
  ]);

  const combatants = battle ? await getBattleCombatants(battle.id) : [];

  const dmCombatants = isGm
    ? combatants
    : combatants.map((c) => ({
        ...c,
        hpTotal: null,
        hpCurrent: null,
        eac: null,
        kac: null,
      }));

  return (
    <InitiativeClient
      campaignId={id}
      userId={user.id}
      isGm={isGm}
      battle={battle}
      combatants={dmCombatants}
      partyMembers={partyMembers}
    />
  );
}
