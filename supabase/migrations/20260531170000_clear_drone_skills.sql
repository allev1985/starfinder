DELETE FROM "character_skills"
WHERE "character_id" IN (
  SELECT c."id"
  FROM "characters" c
  JOIN "races" r ON c."race_id" = r."id"
  WHERE r."type" = 'drone'
);
