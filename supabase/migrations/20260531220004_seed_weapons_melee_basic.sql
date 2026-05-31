-- CRB basic melee weapons. Stats sourced from Archives of Nethys (aonprd.com).
-- Columns: id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special

INSERT INTO weapons (id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special) VALUES
  ('b5000000-0000-0000-0000-000000000001', 'Survival Knife',                  1,  'melee_basic', '1d4',  ARRAY['Slashing'],             NULL,        NULL, NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000002', 'Baton, Tactical',                 1,  'melee_basic', '1d4',  ARRAY['Bludgeoning'],          'Knockdown', NULL, NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000003', 'Tactical Sword',                  1,  'melee_basic', '1d6',  ARRAY['Slashing'],             'Wound',     NULL, NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000004', 'Shock Truncheon',                 1,  'melee_basic', '1d4',  ARRAY['Bludgeoning','Electricity'], 'Wound', NULL, NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000005', 'Taclash',                         1,  'melee_basic', '1d4',  ARRAY['Slashing'],             'Wound',     NULL, NULL, NULL, NULL, 'L',  'Disarm, Reach, Trip'),
  ('b5000000-0000-0000-0000-000000000006', 'Underwater Knife',                1,  'melee_basic', '1d4',  ARRAY['Piercing','Slashing'],  NULL,        NULL, NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000007', 'Handcoil',                        1,  'melee_basic', '1d4',  ARRAY['Electricity'],          'Arc',       '1d4',NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000008', 'Baton, Advanced',                 4,  'melee_basic', '1d6',  ARRAY['Bludgeoning'],          'Knockdown', NULL, NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000009', 'Zero Knife',                      2,  'melee_basic', '1d4',  ARRAY['Cold'],                 'Staggered', NULL, NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000010', 'Ember Flame Doshko',              3,  'melee_basic', '1d8',  ARRAY['Fire'],                 'Burn',      '1d6',NULL, NULL, NULL, '1',  NULL),
  ('b5000000-0000-0000-0000-000000000011', 'Spellblade, Tactical',            1,  'melee_basic', '1d4',  ARRAY['Slashing'],             'Arc',       '1d4',NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000012', 'Longsword, Tactical',             3,  'melee_basic', '1d8',  ARRAY['Slashing'],             'Wound',     NULL, NULL, NULL, NULL, '1',  NULL),
  ('b5000000-0000-0000-0000-000000000013', 'Tactical Spear',                  1,  'melee_basic', '1d6',  ARRAY['Piercing'],             'Wound',     NULL, NULL, NULL, NULL, '1',  NULL),
  ('b5000000-0000-0000-0000-000000000014', 'Truncheon',                       1,  'melee_basic', '1d6',  ARRAY['Bludgeoning'],          'Knockdown', NULL, NULL, NULL, NULL, '1',  NULL),
  ('b5000000-0000-0000-0000-000000000015', 'Dueling Sword, Tactical',         3,  'melee_basic', '1d6',  ARRAY['Slashing'],             'Bleed',     '1d6',NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000016', 'Zero Pistol Bayonet',             3,  'melee_basic', '1d4',  ARRAY['Cold','Piercing'],      'Staggered', NULL, NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000017', 'Battle Ladder',                   2,  'melee_basic', '1d6',  ARRAY['Bludgeoning'],          'Knockdown', NULL, NULL, NULL, NULL, '1',  'Reach'),
  ('b5000000-0000-0000-0000-000000000018', 'Stonehelm Combat Staff',          2,  'melee_basic', '1d6',  ARRAY['Bludgeoning'],          'Knockdown', NULL, NULL, NULL, NULL, '1',  'Reach'),
  ('b5000000-0000-0000-0000-000000000019', 'Tactical Knife',                  1,  'melee_basic', '1d4',  ARRAY['Slashing'],             'Bleed',     '1d6',NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000020', 'Gauntlet, Tactical',              1,  'melee_basic', '1d4',  ARRAY['Bludgeoning'],          'Knockdown', NULL, NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000021', 'Gauntlet, Shocking',              2,  'melee_basic', '1d4',  ARRAY['Bludgeoning','Electricity'], 'Arc',   '1d4',NULL, NULL, NULL, 'L',  NULL),
  ('b5000000-0000-0000-0000-000000000022', 'Incapacitator',                   2,  'melee_basic', '1d4',  ARRAY['Bludgeoning'],          'Stun',      NULL, NULL, NULL, NULL, 'L',  'Stun'),
  ('b5000000-0000-0000-0000-000000000023', 'Flame Pistol Bayonet',            2,  'melee_basic', '1d4',  ARRAY['Fire','Piercing'],      'Burn',      '1d4',NULL, NULL, NULL, 'L',  NULL);
