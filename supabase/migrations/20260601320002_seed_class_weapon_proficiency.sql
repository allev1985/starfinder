-- Seed class_weapon_proficiency for all 7 CRB classes
-- weapon_category enum: small_arms | longarms | heavy | sniper | melee_basic | melee_advanced | grenade | special
-- Class IDs: Envoy b1000000-0000-0000-0000-000000000001
--            Mechanic b1000000-0000-0000-0000-000000000002
--            Mystic b1000000-0000-0000-0000-000000000003
--            Operative b1000000-0000-0000-0000-000000000004
--            Solarian b1000000-0000-0000-0000-000000000005
--            Soldier b1000000-0000-0000-0000-000000000006
--            Technomancer b1000000-0000-0000-0000-000000000007

-- Envoy: basic melee, small arms, grenades
INSERT INTO "class_weapon_proficiency" ("class_id", "weapon_category") VALUES
  ('b1000000-0000-0000-0000-000000000001', 'melee_basic'),
  ('b1000000-0000-0000-0000-000000000001', 'small_arms'),
  ('b1000000-0000-0000-0000-000000000001', 'grenade');

-- Mechanic: basic melee, small arms, grenades
INSERT INTO "class_weapon_proficiency" ("class_id", "weapon_category") VALUES
  ('b1000000-0000-0000-0000-000000000002', 'melee_basic'),
  ('b1000000-0000-0000-0000-000000000002', 'small_arms'),
  ('b1000000-0000-0000-0000-000000000002', 'grenade');

-- Mystic: basic melee, small arms
INSERT INTO "class_weapon_proficiency" ("class_id", "weapon_category") VALUES
  ('b1000000-0000-0000-0000-000000000003', 'melee_basic'),
  ('b1000000-0000-0000-0000-000000000003', 'small_arms');

-- Operative: basic melee, small arms, sniper
INSERT INTO "class_weapon_proficiency" ("class_id", "weapon_category") VALUES
  ('b1000000-0000-0000-0000-000000000004', 'melee_basic'),
  ('b1000000-0000-0000-0000-000000000004', 'small_arms'),
  ('b1000000-0000-0000-0000-000000000004', 'sniper');

-- Solarian: basic melee, advanced melee, small arms, special
INSERT INTO "class_weapon_proficiency" ("class_id", "weapon_category") VALUES
  ('b1000000-0000-0000-0000-000000000005', 'melee_basic'),
  ('b1000000-0000-0000-0000-000000000005', 'melee_advanced'),
  ('b1000000-0000-0000-0000-000000000005', 'small_arms'),
  ('b1000000-0000-0000-0000-000000000005', 'special');

-- Soldier: all weapon categories
INSERT INTO "class_weapon_proficiency" ("class_id", "weapon_category") VALUES
  ('b1000000-0000-0000-0000-000000000006', 'melee_basic'),
  ('b1000000-0000-0000-0000-000000000006', 'melee_advanced'),
  ('b1000000-0000-0000-0000-000000000006', 'small_arms'),
  ('b1000000-0000-0000-0000-000000000006', 'longarms'),
  ('b1000000-0000-0000-0000-000000000006', 'heavy'),
  ('b1000000-0000-0000-0000-000000000006', 'sniper'),
  ('b1000000-0000-0000-0000-000000000006', 'grenade'),
  ('b1000000-0000-0000-0000-000000000006', 'special');

-- Technomancer: basic melee, small arms
INSERT INTO "class_weapon_proficiency" ("class_id", "weapon_category") VALUES
  ('b1000000-0000-0000-0000-000000000007', 'melee_basic'),
  ('b1000000-0000-0000-0000-000000000007', 'small_arms');
