-- Remove skills that are not on the android allowed list from android characters
DELETE FROM "character_skills"
WHERE "character_id" IN (
  SELECT c."id"
  FROM "characters" c
  JOIN "races" r ON c."race_id" = r."id"
  WHERE r."type" = 'android'
)
AND "skill_id" NOT IN (
  'd1000000-0000-0000-0000-000000000001', -- Acrobatics
  'd1000000-0000-0000-0000-000000000002', -- Athletics
  'd1000000-0000-0000-0000-000000000004', -- Computers
  'd1000000-0000-0000-0000-000000000013', -- Perception
  'd1000000-0000-0000-0000-000000000019', -- Stealth
  'd1000000-0000-0000-0000-000000000020'  -- Survival
);

-- Seed any missing android skills for android characters that don't have them yet
INSERT INTO "character_skills" ("id", "character_id", "skill_id", "ranks", "misc_mod")
SELECT
  gen_random_uuid(),
  c."id",
  s."id",
  0,
  0
FROM "characters" c
JOIN "races" r ON c."race_id" = r."id"
CROSS JOIN (
  SELECT "id" FROM "skills"
  WHERE "id" IN (
    'd1000000-0000-0000-0000-000000000001',
    'd1000000-0000-0000-0000-000000000002',
    'd1000000-0000-0000-0000-000000000004',
    'd1000000-0000-0000-0000-000000000013',
    'd1000000-0000-0000-0000-000000000019',
    'd1000000-0000-0000-0000-000000000020'
  )
) s
WHERE r."type" = 'android'
AND NOT EXISTS (
  SELECT 1 FROM "character_skills" cs
  WHERE cs."character_id" = c."id"
  AND cs."skill_id" = s."id"
);
