import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getSpaceshipById, getWeaponsBySpaceship, getNotesBySpaceship, getCampaignWithCharacters, getCrewBySpaceship } from "@/db/queries/campaigns";
import SpaceshipEditor from "../_name-editor";
import SpaceshipActions from "../_spaceship-actions";

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

  const { characters } = await getCampaignWithCharacters(id);
  const [weapons, notes, crew] = await Promise.all([
    getWeaponsBySpaceship(spaceship.id),
    getNotesBySpaceship(spaceship.id),
    getCrewBySpaceship(spaceship.id),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{spaceship.name}</h1>
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
