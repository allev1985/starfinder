import { getRaces, getClasses, getThemes } from "@/db/queries/reference";
import NewCharacterForm from "./_new-form";

export default async function NewCharacterPage() {
  const [races, classes, themes] = await Promise.all([
    getRaces(),
    getClasses(),
    getThemes(),
  ]);

  return (
    <div className="flex flex-1 items-start justify-center p-6">
      <NewCharacterForm races={races} classes={classes} themes={themes} />
    </div>
  );
}
