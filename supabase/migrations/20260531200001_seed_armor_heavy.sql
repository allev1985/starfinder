-- CRB heavy armor. Stats sourced from Archives of Nethys (aonprd.com).
-- Columns: id, name, type, item_level, price, eac_bonus, kac_bonus, max_dex_bonus, armor_check_penalty, speed_adjustment, bulk, upgrade_slots

INSERT INTO armor (id, name, type, item_level, price, eac_bonus, kac_bonus, max_dex_bonus, armor_check_penalty, speed_adjustment, bulk, upgrade_slots) VALUES
  ('a2200000-0000-0000-0000-000000000001', 'Vesk Overplate I',       'heavy', 2,  720,   2,  6,  3, -2, -5, '2', 1),
  ('a2200000-0000-0000-0000-000000000002', 'Golemforged Plating I',  'heavy', 2,  755,   2,  6,  3, -2, -5, '2', 1),
  ('a2200000-0000-0000-0000-000000000003', 'Hidden Soldier Armor',   'heavy', 3,  1220,  3,  7,  3, -2, -5, '2', 1),
  ('a2200000-0000-0000-0000-000000000004', 'Defrex Hide',            'heavy', 3,  1220,  4,  7,  3, -2, -5, '2', 2),
  ('a2200000-0000-0000-0000-000000000005', 'Iridishell, Basic',      'heavy', 4,  2200,  4,  8,  3, -3, -5, '2', 2),
  ('a2200000-0000-0000-0000-000000000006', 'Serra Plate I',          'heavy', 4,  1990,  4,  9,  2, -3, -5, '2', 2),
  ('a2200000-0000-0000-0000-000000000007', 'Golemforged Plating II', 'heavy', 5,  2930,  5,  9,  3, -2, -5, '2', 1),
  ('a2200000-0000-0000-0000-000000000008', 'Vesk Overplate II',      'heavy', 6,  4220,  6,  10, 3, -2, -5, '2', 1),
  ('a2200000-0000-0000-0000-000000000009', 'Serra Plate II',         'heavy', 8,  9200,  8,  12, 2, -3, -5, '2', 3),
  ('a2200000-0000-0000-0000-000000000010', 'Golemforged Plating III','heavy', 9,  13500, 9,  13, 3, -2, -5, '2', 2),
  ('a2200000-0000-0000-0000-000000000011', 'Iridishell, Advanced',   'heavy', 9,  13000, 9,  13, 3, -3, -5, '2', 3),
  ('a2200000-0000-0000-0000-000000000012', 'Vesk Overplate III',     'heavy', 10, 18400, 10, 14, 3, -2, -5, '2', 2),
  ('a2200000-0000-0000-0000-000000000013', 'Serra Plate III',        'heavy', 12, 36500, 12, 16, 2, -3, -5, '2', 3),
  ('a2200000-0000-0000-0000-000000000014', 'Golemforged Plating IV', 'heavy', 13, 50000, 13, 17, 3, -2, -5, '2', 3);
