CREATE TABLE "character_descriptions" (
  "character_id" uuid NOT NULL,
  "description_id" uuid NOT NULL,
  "value" text DEFAULT '' NOT NULL,
  CONSTRAINT "character_descriptions_pk" PRIMARY KEY ("character_id", "description_id")
);

ALTER TABLE "character_descriptions"
  ADD CONSTRAINT "character_descriptions_character_id_fk"
  FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE CASCADE;

ALTER TABLE "character_descriptions"
  ADD CONSTRAINT "character_descriptions_description_id_fk"
  FOREIGN KEY ("description_id") REFERENCES "public"."race_descriptions"("id") ON DELETE CASCADE;
