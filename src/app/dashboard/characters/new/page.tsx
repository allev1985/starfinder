import { getRaces, getClasses, getThemes, getAllChassis } from "@/db/queries/reference";
import NewCharacterForm from "./_new-form";

export default async function NewCharacterPage() {
  const [races, classes, themes, chassisList] = await Promise.all([
    getRaces(),
    getClasses(),
    getThemes(),
    getAllChassis(),
  ]);

  return (
    <div className="flex flex-1 items-start justify-center p-6">
      <NewCharacterForm races={races} classes={classes} themes={themes} chassisList={chassisList} />
    </div>
  );
}
