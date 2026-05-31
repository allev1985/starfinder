ALTER TABLE "characters"
  ADD COLUMN "chassis_id" uuid REFERENCES "chassis"("id"),
  ADD COLUMN "mechanic_character_id" uuid REFERENCES "characters"("id");
