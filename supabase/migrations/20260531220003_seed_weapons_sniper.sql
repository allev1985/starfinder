-- CRB sniper weapons. Stats sourced from Archives of Nethys (aonprd.com).
-- Columns: id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special

INSERT INTO weapons (id, name, item_level, category, damage_dice, damage_types, critical_effect, critical_dice, range, capacity, usage, bulk, special) VALUES
  ('b4000000-0000-0000-0000-000000000001', 'Semi-Auto Rifle, Tactical',       1,  'sniper', '1d10', ARRAY['Piercing'],    'Wound',     NULL,  '90 ft',  12,  1,  '1',  'Sniper (250 ft)'),
  ('b4000000-0000-0000-0000-000000000002', 'Sniper Rifle, Hunting',           2,  'sniper', '1d10', ARRAY['Piercing'],    'Wound',     NULL,  '90 ft',  6,   1,  '1',  'Sniper (500 ft)'),
  ('b4000000-0000-0000-0000-000000000003', 'Laser Rifle, Sniper',             3,  'sniper', '2d6',  ARRAY['Fire'],        'Burn',      '1d6', '150 ft', 10,  1,  '1',  'Sniper (500 ft)'),
  ('b4000000-0000-0000-0000-000000000004', 'Semi-Auto Rifle, Advanced',       5,  'sniper', '2d10', ARRAY['Piercing'],    'Wound',     NULL,  '90 ft',  12,  1,  '1',  'Sniper (250 ft)'),
  ('b4000000-0000-0000-0000-000000000005', 'Sniper Rifle, Elite',             7,  'sniper', '2d10', ARRAY['Piercing'],    'Wound',     NULL,  '90 ft',  6,   1,  '1',  'Sniper (500 ft)'),
  ('b4000000-0000-0000-0000-000000000006', 'Laser Rifle, Sniper Advanced',    9,  'sniper', '4d6',  ARRAY['Fire'],        'Burn',      '2d6', '150 ft', 10,  1,  '1',  'Sniper (500 ft)'),
  ('b4000000-0000-0000-0000-000000000007', 'Semi-Auto Rifle, Suppressor',     11, 'sniper', '4d10', ARRAY['Piercing'],    'Wound',     NULL,  '90 ft',  12,  1,  '1',  'Sniper (250 ft)'),
  ('b4000000-0000-0000-0000-000000000008', 'Void Sniper Rifle',               13, 'sniper', '4d10', ARRAY['Piercing'],    'Wound',     NULL,  '90 ft',  6,   1,  '1',  'Sniper (500 ft)'),
  ('b4000000-0000-0000-0000-000000000009', 'Laser Rifle, Sniper Superior',    15, 'sniper', '6d6',  ARRAY['Fire'],        'Burn',      '4d6', '150 ft', 10,  1,  '1',  'Sniper (500 ft)'),
  ('b4000000-0000-0000-0000-000000000010', 'Semi-Auto Rifle, Paragon',        17, 'sniper', '8d10', ARRAY['Piercing'],    'Wound',     NULL,  '90 ft',  12,  1,  '1',  'Sniper (250 ft)'),
  ('b4000000-0000-0000-0000-000000000011', 'Laser Rifle, Sniper Paragon',     19, 'sniper', '10d6', ARRAY['Fire'],        'Burn',      '4d6', '150 ft', 10,  1,  '1',  'Sniper (500 ft)'),
  ('b4000000-0000-0000-0000-000000000012', 'Void Sniper Rifle, Advanced',     17, 'sniper', '8d10', ARRAY['Piercing'],    'Wound',     NULL,  '90 ft',  6,   1,  '1',  'Sniper (500 ft)');
