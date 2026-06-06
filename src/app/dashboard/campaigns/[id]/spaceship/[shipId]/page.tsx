import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getSpaceshipById, getWeaponsBySpaceship, getNotesBySpaceship, getCampaignWithCharacters, getCrewBySpaceship } from "@/db/queries/campaigns";
import SpaceshipEditor from "../_name-editor";
import SpaceshipActions from "../_spaceship-actions";
import SpaceshipAppBar from "../_spaceship-app-bar";

export default async function SpaceshipPage({
  params,
}: {
  params: Promise<{ id: string; shipId: string }>;
}) {
  const { id, shipId } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const spaceship = await getSpaceshipById(shipId);
  if (!spaceship || spaceship.campaignId !== id) notFound();

  const { campaign, characters } = await getCampaignWithCharacters(id);
  const [weapons, notes, crew] = await Promise.all([
    getWeaponsBySpaceship(spaceship.id),
    getNotesBySpaceship(spaceship.id),
    getCrewBySpaceship(spaceship.id),
  ]);

  return (
    <div className="p-5">
      <SpaceshipAppBar shipName={spaceship.name} tier={spaceship.tier ?? ""} />
      <div className="mb-1 text-sm" style={{ color: "var(--text-3)" }}>
        <Link href={`/dashboard/campaigns/${id}`} className="hover:underline" style={{ color: "var(--text-2)" }}>
          {campaign?.name ?? "Campaign"}
        </Link>
        {" / "}
        {spaceship.name}
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 24, color: "var(--text-1)" }}>
          {spaceship.name}
        </h1>
        <SpaceshipActions campaignId={id} spaceshipId={spaceship.id} />
      </div>
      <SpaceshipEditor
        campaignId={id}
        spaceship={spaceship}
        weapons={weapons}
        notes={notes}
        characters={characters}
        initialCrew={crew}
      />
    </div>
  );
}
