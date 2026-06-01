-- Mystic (b1000000-0000-0000-0000-000000000003) and Technomancer (b1000000-0000-0000-0000-000000000007)
-- have identical spells known progression per the CRB.
-- Only rows where the spell level is unlocked are inserted.

INSERT INTO class_spell_progression (class_id, character_level, spell_level, spells_known)
SELECT class_id, character_level, spell_level, spells_known
FROM (VALUES
  -- Level 0 cantrips (always known from level 1, count increases with level)
  (1, 0, 4),(2, 0, 5),(3, 0, 5),(4, 0, 6),(5, 0, 6),(6, 0, 7),
  (7, 0, 7),(8, 0, 8),(9, 0, 8),(10, 0, 9),(11, 0, 9),(12, 0, 9),
  (13, 0, 9),(14, 0, 9),(15, 0, 9),(16, 0, 9),(17, 0, 9),(18, 0, 9),(19, 0, 9),(20, 0, 9),
  -- 1st-level spells
  (1, 1, 2),(2, 1, 3),(3, 1, 4),(4, 1, 4),(5, 1, 4),(6, 1, 4),
  (7, 1, 4),(8, 1, 4),(9, 1, 4),(10, 1, 5),(11, 1, 5),(12, 1, 5),
  (13, 1, 5),(14, 1, 5),(15, 1, 5),(16, 1, 5),(17, 1, 5),(18, 1, 5),(19, 1, 5),(20, 1, 5),
  -- 2nd-level spells (unlocked at class level 3)
  (3, 2, 2),(4, 2, 3),(5, 2, 4),(6, 2, 4),(7, 2, 4),(8, 2, 4),
  (9, 2, 4),(10, 2, 4),(11, 2, 5),(12, 2, 5),(13, 2, 5),(14, 2, 5),
  (15, 2, 5),(16, 2, 5),(17, 2, 5),(18, 2, 5),(19, 2, 5),(20, 2, 5),
  -- 3rd-level spells (unlocked at class level 5)
  (5, 3, 2),(6, 3, 3),(7, 3, 4),(8, 3, 4),(9, 3, 4),(10, 3, 4),
  (11, 3, 4),(12, 3, 5),(13, 3, 5),(14, 3, 5),(15, 3, 5),(16, 3, 5),
  (17, 3, 5),(18, 3, 5),(19, 3, 5),(20, 3, 5),
  -- 4th-level spells (unlocked at class level 7)
  (7, 4, 2),(8, 4, 3),(9, 4, 4),(10, 4, 4),(11, 4, 4),(12, 4, 4),
  (13, 4, 5),(14, 4, 5),(15, 4, 5),(16, 4, 5),(17, 4, 5),(18, 4, 5),(19, 4, 5),(20, 4, 5),
  -- 5th-level spells (unlocked at class level 9)
  (9, 5, 2),(10, 5, 3),(11, 5, 4),(12, 5, 4),(13, 5, 4),(14, 5, 5),
  (15, 5, 5),(16, 5, 5),(17, 5, 5),(18, 5, 5),(19, 5, 5),(20, 5, 5),
  -- 6th-level spells (unlocked at class level 11)
  (11, 6, 2),(12, 6, 3),(13, 6, 4),(14, 6, 4),(15, 6, 5),(16, 6, 5),
  (17, 6, 5),(18, 6, 5),(19, 6, 5),(20, 6, 5)
) AS t(character_level, spell_level, spells_known)
CROSS JOIN (
  VALUES
    ('b1000000-0000-0000-0000-000000000003'::uuid),
    ('b1000000-0000-0000-0000-000000000007'::uuid)
) AS c(class_id);
