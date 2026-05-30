CREATE TABLE character_combat_stats (
  character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  initiative_misc_mod INT NOT NULL DEFAULT 0
);

INSERT INTO character_combat_stats (character_id)
SELECT id FROM characters
ON CONFLICT DO NOTHING;
