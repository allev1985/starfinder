-- editions reference table
CREATE TABLE "editions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL,
  "name" text NOT NULL,
  CONSTRAINT "editions_slug_unique" UNIQUE ("slug")
);

-- Starfinder 1st Edition seed row (fixed UUID — used by all backfills)
INSERT INTO "editions" ("id", "slug", "name") VALUES
  ('00000000-0000-0000-0000-000000000001', '1e', 'Starfinder 1st Edition');

-- Add edition_id to reference tables (DEFAULT backfills existing rows; DROP DEFAULT enforces explicit values going forward)
ALTER TABLE "weapons"         ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "armor"           ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "skills"          ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "classes"         ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "themes"          ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "races"           ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "feats"           ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "spells"          ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "chassis"         ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "class_abilities" ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "theme_abilities" ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "race_descriptions" ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "characters"      ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");
ALTER TABLE "campaigns"       ADD COLUMN "edition_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES "editions"("id");

-- Drop defaults so future inserts must supply edition_id explicitly
ALTER TABLE "weapons"         ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "armor"           ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "skills"          ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "classes"         ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "themes"          ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "races"           ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "feats"           ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "spells"          ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "chassis"         ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "class_abilities" ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "theme_abilities" ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "race_descriptions" ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "characters"      ALTER COLUMN "edition_id" DROP DEFAULT;
ALTER TABLE "campaigns"       ALTER COLUMN "edition_id" DROP DEFAULT;
