import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getCharactersByOwner } from "@/db/queries/characters";

export default async function CharactersPage() {
  const user = await getUser();
  if (!user) redirect("/");

  const characters = await getCharactersByOwner(user.id);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Characters</h1>
        <Link
          href="/dashboard/characters/new"
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          + New
        </Link>
      </div>

      {characters.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No characters yet.{" "}
          <Link href="/dashboard/characters/new" className="underline underline-offset-4">
            Create one
          </Link>{" "}
          to get started.
        </p>
      ) : (
        <ul className="flex flex-col divide-y">
          {characters.map((character) => (
            <li key={character.id}>
              <Link
                href={`/dashboard/characters/${character.id}`}
                className="block py-3 text-sm font-medium hover:text-foreground/80"
              >
                {character.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
