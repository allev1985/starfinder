-- CRB heavy weapons. Stats sourced from Archives of Nethys (aonprd.com).
-- Columns: id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special

INSERT INTO weapons (id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special) VALUES
  ('b3000000-0000-0000-0000-000000000001', 'Flamethrower, Tactical',          2,  'heavy', '1d6',  ARRAY['Fire'],              'Burn',      '1d6', '15 ft', 20,  4,  '2',  'Line'),
  ('b3000000-0000-0000-0000-000000000002', 'Acid Cannon, Tactical',           3,  'heavy', '2d6',  ARRAY['Acid'],              'Corrode',   '2d6', '60 ft', 10,  2,  '2',  'Line'),
  ('b3000000-0000-0000-0000-000000000003', 'Plasma Cannon, Red Star',         4,  'heavy', '2d10', ARRAY['Fire','Electricity'], 'Severe Wound', NULL, '100 ft', 10, 5, '2', NULL),
  ('b3000000-0000-0000-0000-000000000004', 'Mining Laser',                    4,  'heavy', '2d6',  ARRAY['Fire'],              'Burn',      '2d6', '60 ft', 20,  5,  '2',  'Line'),
  ('b3000000-0000-0000-0000-000000000005', 'Gyrojet Cannon, Tactical',        5,  'heavy', '2d12', ARRAY['Bludgeoning'],       'Knockdown', NULL,  '120 ft',6,   1,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000006', 'Flamethrower, Advanced',          7,  'heavy', '2d6',  ARRAY['Fire'],              'Burn',      '2d6', '15 ft', 40,  4,  '2',  'Line'),
  ('b3000000-0000-0000-0000-000000000007', 'Laser Cannon, Azimuth',           2,  'heavy', '1d10', ARRAY['Fire'],              'Burn',      '1d6', '120 ft',20,  2,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000008', 'Laser Cannon, Corona',            6,  'heavy', '2d10', ARRAY['Fire'],              'Burn',      '2d6', '120 ft',20,  2,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000009', 'Zero Cannon, Frostbite',          5,  'heavy', '2d8',  ARRAY['Cold'],              'Staggered', NULL,  '60 ft', 20,  4,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000010', 'Plasma Cannon, White Star',       10, 'heavy', '3d10', ARRAY['Fire','Electricity'], 'Severe Wound', NULL, '100 ft', 10, 5, '2', NULL),
  ('b3000000-0000-0000-0000-000000000011', 'Gyrojet Cannon, Advanced',        10, 'heavy', '4d12', ARRAY['Bludgeoning'],       'Knockdown', NULL,  '120 ft',6,   1,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000012', 'Laser Cannon, Zenith',            10, 'heavy', '4d10', ARRAY['Fire'],              'Burn',      '2d6', '120 ft',20,  2,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000013', 'Plasma Cannon, Blue Star',        14, 'heavy', '5d10', ARRAY['Fire','Electricity'], 'Severe Wound', NULL, '100 ft', 10, 5, '2', NULL),
  ('b3000000-0000-0000-0000-000000000014', 'Zero Cannon, Hailstorm',          13, 'heavy', '5d8',  ARRAY['Cold'],              'Staggered', NULL,  '60 ft', 20,  4,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000015', 'Laser Cannon, Aphelion',          14, 'heavy', '5d10', ARRAY['Fire'],              'Burn',      '4d6', '120 ft',20,  2,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000016', 'Plasma Cannon, Stellar',          18, 'heavy', '6d10', ARRAY['Fire','Electricity'], 'Severe Wound', NULL, '100 ft', 10, 5, '2', NULL),
  ('b3000000-0000-0000-0000-000000000017', 'Zero Cannon, Blizzard',           17, 'heavy', '8d8',  ARRAY['Cold'],              'Staggered', NULL,  '60 ft', 20,  4,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000018', 'Laser Cannon, Perihelion',        18, 'heavy', '8d10', ARRAY['Fire'],              'Burn',      '4d6', '120 ft',20,  2,  '2',  NULL),
  ('b3000000-0000-0000-0000-000000000019', 'Acid Cannon, Advanced',           9,  'heavy', '4d6',  ARRAY['Acid'],              'Corrode',   '2d6', '60 ft', 10,  2,  '2',  'Line'),
  ('b3000000-0000-0000-0000-000000000020', 'Flamethrower, Incendiary',        13, 'heavy', '4d6',  ARRAY['Fire'],              'Burn',      '4d6', '15 ft', 40,  4,  '2',  'Line');
