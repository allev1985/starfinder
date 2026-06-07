CREATE TABLE IF NOT EXISTS "conditions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "description" text NOT NULL,
  "edition_id" uuid NOT NULL REFERENCES "editions"("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "conditions_edition_slug_unique" ON "conditions" ("edition_id", "slug");

CREATE TABLE IF NOT EXISTS "character_conditions" (
  "character_id" uuid NOT NULL REFERENCES "characters"("id") ON DELETE CASCADE,
  "condition_id" uuid NOT NULL REFERENCES "conditions"("id") ON DELETE CASCADE,
  PRIMARY KEY ("character_id", "condition_id")
);
