CREATE TABLE "chassis" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "bonus_skill_id" uuid REFERENCES "skills"("id"),
  "default_str" integer NOT NULL DEFAULT 10,
  "default_dex" integer NOT NULL DEFAULT 10,
  "default_int" integer NOT NULL DEFAULT 10,
  "default_wis" integer NOT NULL DEFAULT 10,
  "default_cha" integer NOT NULL DEFAULT 10
);
