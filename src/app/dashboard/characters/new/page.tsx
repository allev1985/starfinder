import { getRaces, getClasses, getThemes, getAllChassis, getDroneSkills } from "@/db/queries/reference";
import NewCharacterForm from "./_new-form";

export default async function NewCharacterPage() {
  const [races, classes, themes, chassisList, droneSkills] = await Promise.all([
    getRaces(),
    getClasses(),
    getThemes(),
    getAllChassis(),
    getDroneSkills(),
  ]);

  return (
    <div className="flex flex-1 items-start justify-center p-6">
      <NewCharacterForm races={races} classes={classes} themes={themes} chassisList={chassisList} droneSkills={droneSkills} />
    </div>
  );
}
