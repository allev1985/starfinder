-- CRB ammunition. Stats sourced from Archives of Nethys (aonprd.com).
-- Columns: id, name, category, item_level, price, bulk, ammo_type, ammo_capacity

INSERT INTO equipment (id, name, category, item_level, price, bulk, ammo_type, ammo_capacity) VALUES
  -- Batteries (reusable)
  ('ec040000-0000-0000-0000-000000000001', 'Battery (20-charge)',    'ammunition', 1, 60,   'L', 'battery',         20),
  ('ec040000-0000-0000-0000-000000000002', 'Battery (40-charge)',    'ammunition', 1, 80,   'L', 'battery',         40),
  ('ec040000-0000-0000-0000-000000000003', 'Battery (80-charge)',    'ammunition', 1, 100,  'L', 'battery',         80),
  ('ec040000-0000-0000-0000-000000000004', 'Battery (100-charge)',   'ammunition', 1, 130,  'L', 'battery',         100),
  -- Petrochem Fuel
  ('ec040000-0000-0000-0000-000000000005', 'Petrochem Fuel (20)',    'ammunition', 1, 50,   'L', 'petrochem_fuel',  20),
  ('ec040000-0000-0000-0000-000000000006', 'Petrochem Fuel (40)',    'ammunition', 1, 90,   'L', 'petrochem_fuel',  40),
  -- Rounds
  ('ec040000-0000-0000-0000-000000000007', 'Small Arm Rounds (30)', 'ammunition', 1, 40,   'L', 'small_arm_rounds', 30),
  ('ec040000-0000-0000-0000-000000000008', 'Longarm Rounds (30)',   'ammunition', 1, 50,   'L', 'longarm_rounds',   30),
  ('ec040000-0000-0000-0000-000000000009', 'Heavy Rounds (12)',     'ammunition', 1, 60,   'L', 'heavy_rounds',     12),
  ('ec040000-0000-0000-0000-000000000010', 'Sniper Rounds (6)',     'ammunition', 1, 50,   'L', 'sniper_rounds',    6),
  -- Shells and other projectiles
  ('ec040000-0000-0000-0000-000000000011', 'Shells (10)',           'ammunition', 1, 10,   'L', 'shells',           10),
  ('ec040000-0000-0000-0000-000000000012', 'Darts (20)',            'ammunition', 1, 20,   'L', 'darts',            20),
  -- Missiles
  ('ec040000-0000-0000-0000-000000000013', 'Missile (Level 1)',     'ammunition', 1, 95,   'L', 'missiles',         1),
  ('ec040000-0000-0000-0000-000000000014', 'Missile (Level 4)',     'ammunition', 4, 375,  'L', 'missiles',         1),
  ('ec040000-0000-0000-0000-000000000015', 'Missile (Level 8)',     'ammunition', 8, 1400, 'L', 'missiles',         1);
