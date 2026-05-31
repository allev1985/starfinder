-- CRB grenades. Stats sourced from Archives of Nethys (aonprd.com).
-- Grenades have no capacity/usage (single use), range is throwing range, bulk is L.
-- Columns: id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special

INSERT INTO weapons (id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special) VALUES
  ('b7000000-0000-0000-0000-000000000001', 'Frag Grenade I',                  1,  'grenade', '1d6',  ARRAY['Piercing'],    NULL,    NULL, '60 ft', NULL, NULL, 'L',  'Explode (5 ft)'),
  ('b7000000-0000-0000-0000-000000000002', 'Frag Grenade II',                 5,  'grenade', '2d6',  ARRAY['Piercing'],    NULL,    NULL, '60 ft', NULL, NULL, 'L',  'Explode (10 ft)'),
  ('b7000000-0000-0000-0000-000000000003', 'Frag Grenade III',                9,  'grenade', '4d6',  ARRAY['Piercing'],    NULL,    NULL, '60 ft', NULL, NULL, 'L',  'Explode (15 ft)'),
  ('b7000000-0000-0000-0000-000000000004', 'Frag Grenade IV',                 13, 'grenade', '8d6',  ARRAY['Piercing'],    NULL,    NULL, '60 ft', NULL, NULL, 'L',  'Explode (15 ft)'),
  ('b7000000-0000-0000-0000-000000000005', 'Frag Grenade V',                  17, 'grenade', '12d6', ARRAY['Piercing'],    NULL,    NULL, '60 ft', NULL, NULL, 'L',  'Explode (20 ft)'),
  ('b7000000-0000-0000-0000-000000000006', 'Incendiary Grenade I',            2,  'grenade', '1d6',  ARRAY['Fire'],        'Burn',  '1d4','60 ft', NULL, NULL, 'L',  'Explode (5 ft)'),
  ('b7000000-0000-0000-0000-000000000007', 'Incendiary Grenade II',           6,  'grenade', '2d6',  ARRAY['Fire'],        'Burn',  '1d6','60 ft', NULL, NULL, 'L',  'Explode (10 ft)'),
  ('b7000000-0000-0000-0000-000000000008', 'Incendiary Grenade III',          10, 'grenade', '4d6',  ARRAY['Fire'],        'Burn',  '2d6','60 ft', NULL, NULL, 'L',  'Explode (15 ft)'),
  ('b7000000-0000-0000-0000-000000000009', 'Incendiary Grenade IV',           14, 'grenade', '6d6',  ARRAY['Fire'],        'Burn',  '3d6','60 ft', NULL, NULL, 'L',  'Explode (15 ft)'),
  ('b7000000-0000-0000-0000-000000000010', 'Flashbang Grenade I',             2,  'grenade', '1d8',  ARRAY['Sonic'],       'Deafen',NULL, '60 ft', NULL, NULL, 'L',  'Explode (5 ft), Blind'),
  ('b7000000-0000-0000-0000-000000000011', 'Flashbang Grenade II',            6,  'grenade', '2d8',  ARRAY['Sonic'],       'Deafen',NULL, '60 ft', NULL, NULL, 'L',  'Explode (10 ft), Blind'),
  ('b7000000-0000-0000-0000-000000000012', 'Flashbang Grenade III',           10, 'grenade', '4d8',  ARRAY['Sonic'],       'Deafen',NULL, '60 ft', NULL, NULL, 'L',  'Explode (15 ft), Blind'),
  ('b7000000-0000-0000-0000-000000000013', 'Shock Grenade I',                 2,  'grenade', '1d8',  ARRAY['Electricity'], 'Arc',   '1d6','60 ft', NULL, NULL, 'L',  'Explode (5 ft)'),
  ('b7000000-0000-0000-0000-000000000014', 'Shock Grenade II',                6,  'grenade', '2d8',  ARRAY['Electricity'], 'Arc',   '2d6','60 ft', NULL, NULL, 'L',  'Explode (10 ft)'),
  ('b7000000-0000-0000-0000-000000000015', 'Shock Grenade III',               10, 'grenade', '4d8',  ARRAY['Electricity'], 'Arc',   '2d6','60 ft', NULL, NULL, 'L',  'Explode (15 ft)'),
  ('b7000000-0000-0000-0000-000000000016', 'Cryo Grenade I',                  2,  'grenade', '1d8',  ARRAY['Cold'],        'Staggered', NULL,'60 ft',NULL, NULL,'L',  'Explode (5 ft)'),
  ('b7000000-0000-0000-0000-000000000017', 'Cryo Grenade II',                 6,  'grenade', '2d8',  ARRAY['Cold'],        'Staggered', NULL,'60 ft',NULL, NULL,'L',  'Explode (10 ft)'),
  ('b7000000-0000-0000-0000-000000000018', 'Cryo Grenade III',                10, 'grenade', '4d8',  ARRAY['Cold'],        'Staggered', NULL,'60 ft',NULL, NULL,'L',  'Explode (15 ft)'),
  ('b7000000-0000-0000-0000-000000000019', 'Smoke Grenade',                   1,  'grenade', '0d0',  ARRAY['Sonic'],       NULL,    NULL, '60 ft', NULL, NULL, 'L',  'Explode (20 ft), Smoke');
