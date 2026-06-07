CREATE TABLE IF NOT EXISTS "session_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "campaign_id" uuid NOT NULL REFERENCES "campaigns"("id") ON DELETE CASCADE,
  "session_number" integer,
  "title" text NOT NULL,
  "session_date" text,
  "dm_storage_path" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "session_note_character_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "session_note_id" uuid NOT NULL REFERENCES "session_notes"("id") ON DELETE CASCADE,
  "character_id" uuid NOT NULL REFERENCES "characters"("id") ON DELETE CASCADE,
  "storage_path" text NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "session_note_character_entries_unique"
  ON "session_note_character_entries" ("session_note_id", "character_id");
