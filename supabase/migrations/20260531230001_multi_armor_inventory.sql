-- Add character_armor inventory table; drop equipped_armor_id from characters

ALTER TABLE characters DROP COLUMN IF EXISTS equipped_armor_id;

CREATE TABLE IF NOT EXISTS character_armor (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  armor_id uuid NOT NULL REFERENCES armor(id),
  worn boolean NOT NULL DEFAULT false
);
