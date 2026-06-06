import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getSpaceshipByCampaign, getWeaponsBySpaceship } from "@/db/queries/campaigns";
import CreateSpaceshipForm from "./_create-form";
import SpaceshipEditor from "./_name-editor";
import SpaceshipActions from "./_spaceship-actions";

export default async function SpaceshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const spaceship = await getSpaceshipByCampaign(id);
  const weapons = spaceship ? await getWeaponsBySpaceship(spaceship.id) : [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Spaceship</h1>
        {spaceship && (
          <SpaceshipActions campaignId={id} spaceshipId={spaceship.id} />
        )}
      </div>
      {spaceship ? (
        <SpaceshipEditor campaignId={id} spaceship={spaceship} weapons={weapons} />
      ) : (
        <CreateSpaceshipForm campaignId={id} />
      )}
    </div>
  );
}
