-- CRB special weapons. Stats sourced from Archives of Nethys (aonprd.com).
-- Columns: id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special

INSERT INTO weapons (id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special) VALUES
  ('b8000000-0000-0000-0000-000000000001', 'Flare Gun',                       1,  'special', '1d3',  ARRAY['Fire'],        'Burn',      '1d4', '30 ft',  1,  1,  'L',  'Explode (5 ft)'),
  ('b8000000-0000-0000-0000-000000000002', 'Stickybomb Launcher',             3,  'special', '1d6',  ARRAY['Acid'],        'Corrode',   '1d4', '60 ft',  4,  1,  '1',  'Explode (5 ft)'),
  ('b8000000-0000-0000-0000-000000000003', 'Needler, Tactical',               2,  'special', '1d6',  ARRAY['Piercing'],    'Injection DC +2', NULL,'60 ft', 10, 1, '1', 'Injection'),
  ('b8000000-0000-0000-0000-000000000004', 'Needler, Advanced',               8,  'special', '2d6',  ARRAY['Piercing'],    'Injection DC +2', NULL,'60 ft', 16, 1, '1', 'Injection'),
  ('b8000000-0000-0000-0000-000000000005', 'Riot Grenade Launcher',           5,  'special', '1d8',  ARRAY['Bludgeoning'], 'Knockdown', NULL,  '60 ft',  6,  1,  '2',  'Explode (10 ft)'),
  ('b8000000-0000-0000-0000-000000000006', 'Net Launcher, Tactical',          1,  'special', '0d0',  ARRAY['Bludgeoning'], NULL,        NULL,  '15 ft',  1,  1,  '1',  'Explode (5 ft)'),
  ('b8000000-0000-0000-0000-000000000007', 'Seeker Rifle',                    8,  'special', '3d8',  ARRAY['Piercing'],    'Wound',     NULL,  '60 ft',  6,  1,  '1',  'Sniper (1000 ft)'),
  ('b8000000-0000-0000-0000-000000000008', 'Rail Gun, Tactical',              8,  'special', '2d10', ARRAY['Piercing'],    'Wound',     NULL,  '100 ft', 6,  1,  '2',  'Line'),
  ('b8000000-0000-0000-0000-000000000009', 'Rail Gun, Advanced',              14, 'special', '4d10', ARRAY['Piercing'],    'Wound',     NULL,  '100 ft', 6,  1,  '2',  'Line'),
  ('b8000000-0000-0000-0000-000000000010', 'Wave Modulator, Mk 1',            2,  'special', '1d6',  ARRAY['Sonic'],       'Deafen',    NULL,  '60 ft',  20, 2,  '1',  'Automatic'),
  ('b8000000-0000-0000-0000-000000000011', 'Wave Modulator, Mk 2',            8,  'special', '2d6',  ARRAY['Sonic'],       'Deafen',    NULL,  '60 ft',  40, 2,  '1',  'Automatic'),
  ('b8000000-0000-0000-0000-000000000012', 'Reaction Cannon, Light',          4,  'special', '2d10', ARRAY['Bludgeoning'], 'Knockdown', NULL,  '60 ft',  1,  1,  '2',  'Unwieldy'),
  ('b8000000-0000-0000-0000-000000000013', 'Reaction Cannon, Heavy',          12, 'special', '5d10', ARRAY['Bludgeoning'], 'Knockdown', NULL,  '60 ft',  1,  1,  '2',  'Unwieldy');
