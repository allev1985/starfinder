CREATE TABLE IF NOT EXISTS "character_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "character_id" uuid NOT NULL REFERENCES "characters"("id") ON DELETE CASCADE,
  "type" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
