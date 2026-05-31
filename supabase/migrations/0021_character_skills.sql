-- Add skill_ranks_per_level to classes
ALTER TABLE classes ADD COLUMN skill_ranks_per_level INTEGER NOT NULL DEFAULT 0;

UPDATE classes SET skill_ranks_per_level = 8 WHERE name = 'Envoy';
UPDATE classes SET skill_ranks_per_level = 4 WHERE name = 'Mechanic';
UPDATE classes SET skill_ranks_per_level = 6 WHERE name = 'Mystic';
UPDATE classes SET skill_ranks_per_level = 8 WHERE name = 'Operative';
UPDATE classes SET skill_ranks_per_level = 4 WHERE name = 'Solarian';
UPDATE classes SET skill_ranks_per_level = 4 WHERE name = 'Soldier';
UPDATE classes SET skill_ranks_per_level = 4 WHERE name = 'Technomancer';

-- Character skills table
CREATE TABLE character_skills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id  UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  skill_id      UUID NOT NULL REFERENCES skills(id),
  label         TEXT,
  ranks         INTEGER NOT NULL DEFAULT 0,
  misc_mod      INTEGER NOT NULL DEFAULT 0
);
