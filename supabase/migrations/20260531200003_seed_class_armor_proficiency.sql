-- Class armor proficiency seed.
-- Light-only: Envoy, Mechanic, Mystic, Operative, Technomancer
-- Light + Heavy: Solarian, Soldier
-- Powered: no class (requires feat — deferred to feat system)
--
-- Class UUIDs from 0001_furry_hellfire_club.sql seed:
--   Envoy        b1000000-0000-0000-0000-000000000001
--   Mechanic     b1000000-0000-0000-0000-000000000002
--   Mystic       b1000000-0000-0000-0000-000000000003
--   Operative    b1000000-0000-0000-0000-000000000004
--   Solarian     b1000000-0000-0000-0000-000000000005
--   Soldier      b1000000-0000-0000-0000-000000000006
--   Technomancer b1000000-0000-0000-0000-000000000007

INSERT INTO class_armor_proficiency (class_id, armor_type) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'light'),
  ('b1000000-0000-0000-0000-000000000002', 'light'),
  ('b1000000-0000-0000-0000-000000000003', 'light'),
  ('b1000000-0000-0000-0000-000000000004', 'light'),
  ('b1000000-0000-0000-0000-000000000005', 'light'),
  ('b1000000-0000-0000-0000-000000000005', 'heavy'),
  ('b1000000-0000-0000-0000-000000000006', 'light'),
  ('b1000000-0000-0000-0000-000000000006', 'heavy'),
  ('b1000000-0000-0000-0000-000000000007', 'light');
