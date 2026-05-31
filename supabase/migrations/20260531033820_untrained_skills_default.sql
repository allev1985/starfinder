-- Backfill untrained skill rows for all existing characters
INSERT INTO character_skills (id, character_id, skill_id, ranks, misc_mod)
SELECT gen_random_uuid(), c.id, s.id, 0, 0
FROM characters c
CROSS JOIN skills s
WHERE s.trained_only = FALSE
AND NOT EXISTS (
  SELECT 1 FROM character_skills cs
  WHERE cs.character_id = c.id AND cs.skill_id = s.id
);
