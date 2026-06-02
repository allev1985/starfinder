-- Mystic (b1000000-0000-0000-0000-000000000003) and Technomancer (b1000000-0000-0000-0000-000000000007)
-- share identical spells-per-day progression per the CRB.
-- Cantrips (spell_level 0) have no slot limit; only levels 1-6 are updated.

UPDATE class_spell_progression AS csp
SET spells_per_day = v.spells_per_day
FROM (VALUES
  -- character_level, spell_level, spells_per_day
  -- Level 1: only 1st-level unlocked
  (1, 1, 3),
  -- Level 2
  (2, 1, 4),
  -- Level 3: 2nd-level unlocked
  (3, 1, 4), (3, 2, 3),
  -- Level 4
  (4, 1, 4), (4, 2, 4),
  -- Level 5: 3rd-level unlocked
  (5, 1, 4), (5, 2, 4), (5, 3, 3),
  -- Level 6
  (6, 1, 4), (6, 2, 4), (6, 3, 4),
  -- Level 7: 4th-level unlocked
  (7, 1, 4), (7, 2, 4), (7, 3, 4), (7, 4, 3),
  -- Level 8
  (8, 1, 4), (8, 2, 4), (8, 3, 4), (8, 4, 4),
  -- Level 9: 5th-level unlocked
  (9, 1, 4), (9, 2, 4), (9, 3, 4), (9, 4, 4), (9, 5, 3),
  -- Level 10
  (10, 1, 4), (10, 2, 4), (10, 3, 4), (10, 4, 4), (10, 5, 4),
  -- Level 11: 6th-level unlocked
  (11, 1, 4), (11, 2, 4), (11, 3, 4), (11, 4, 4), (11, 5, 4), (11, 6, 3),
  -- Level 12
  (12, 1, 4), (12, 2, 4), (12, 3, 4), (12, 4, 4), (12, 5, 4), (12, 6, 4),
  -- Level 13: 1st bumps to 5
  (13, 1, 5), (13, 2, 4), (13, 3, 4), (13, 4, 4), (13, 5, 4), (13, 6, 4),
  -- Level 14: 2nd bumps to 5
  (14, 1, 5), (14, 2, 5), (14, 3, 4), (14, 4, 4), (14, 5, 4), (14, 6, 4),
  -- Level 15: 3rd bumps to 5
  (15, 1, 5), (15, 2, 5), (15, 3, 5), (15, 4, 4), (15, 5, 4), (15, 6, 4),
  -- Level 16: 4th bumps to 5
  (16, 1, 5), (16, 2, 5), (16, 3, 5), (16, 4, 5), (16, 5, 4), (16, 6, 4),
  -- Level 17: 5th bumps to 5
  (17, 1, 5), (17, 2, 5), (17, 3, 5), (17, 4, 5), (17, 5, 5), (17, 6, 4),
  -- Level 18: 6th bumps to 5
  (18, 1, 5), (18, 2, 5), (18, 3, 5), (18, 4, 5), (18, 5, 5), (18, 6, 5),
  -- Level 19
  (19, 1, 5), (19, 2, 5), (19, 3, 5), (19, 4, 5), (19, 5, 5), (19, 6, 5),
  -- Level 20
  (20, 1, 5), (20, 2, 5), (20, 3, 5), (20, 4, 5), (20, 5, 5), (20, 6, 5)
) AS v(character_level, spell_level, spells_per_day)
WHERE csp.character_level = v.character_level
  AND csp.spell_level = v.spell_level
  AND csp.class_id IN (
    'b1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000007'
  );
