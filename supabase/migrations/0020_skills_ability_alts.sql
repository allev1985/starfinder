ALTER TABLE skills
  ADD COLUMN ability_alts TEXT[] NULL;

-- Profession (d1000000-0000-0000-0000-000000000016) supports WIS (primary), INT, or CHA
UPDATE skills
SET ability_alts = ARRAY['INT', 'CHA']
WHERE id = 'd1000000-0000-0000-0000-000000000016';
