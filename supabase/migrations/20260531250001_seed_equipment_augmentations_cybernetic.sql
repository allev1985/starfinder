-- CRB cybernetic augmentations. Stats sourced from Archives of Nethys (aonprd.com).
-- Columns: id, name, category, item_level, price, bulk, system, ammo_type, ammo_capacity, bonus_hint, source_book

INSERT INTO equipment (id, name, category, item_level, price, bulk, system, bonus_hint) VALUES
  -- Brain
  ('ec010000-0000-0000-0000-000000000001', 'Mk 1 Synaptic Accelerator (Strength)',     'augmentation_cybernetic', 5,  9000,   'L', 'brain', 'Apply +2 to STR score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000002', 'Mk 1 Synaptic Accelerator (Dexterity)',    'augmentation_cybernetic', 5,  9000,   'L', 'brain', 'Apply +2 to DEX score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000003', 'Mk 1 Synaptic Accelerator (Constitution)', 'augmentation_cybernetic', 5,  9000,   'L', 'brain', 'Apply +2 to CON score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000004', 'Mk 1 Synaptic Accelerator (Intelligence)', 'augmentation_cybernetic', 5,  9000,   'L', 'brain', 'Apply +2 to INT score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000005', 'Mk 1 Synaptic Accelerator (Wisdom)',       'augmentation_cybernetic', 5,  9000,   'L', 'brain', 'Apply +2 to WIS score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000006', 'Mk 1 Synaptic Accelerator (Charisma)',     'augmentation_cybernetic', 5,  9000,   'L', 'brain', 'Apply +2 to CHA score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000007', 'Mk 2 Synaptic Accelerator (Strength)',     'augmentation_cybernetic', 11, 42500,  'L', 'brain', 'Apply +4 to STR score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000008', 'Mk 2 Synaptic Accelerator (Dexterity)',    'augmentation_cybernetic', 11, 42500,  'L', 'brain', 'Apply +4 to DEX score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000009', 'Mk 2 Synaptic Accelerator (Constitution)', 'augmentation_cybernetic', 11, 42500,  'L', 'brain', 'Apply +4 to CON score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000010', 'Mk 2 Synaptic Accelerator (Intelligence)', 'augmentation_cybernetic', 11, 42500,  'L', 'brain', 'Apply +4 to INT score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000011', 'Mk 2 Synaptic Accelerator (Wisdom)',       'augmentation_cybernetic', 11, 42500,  'L', 'brain', 'Apply +4 to WIS score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000012', 'Mk 2 Synaptic Accelerator (Charisma)',     'augmentation_cybernetic', 11, 42500,  'L', 'brain', 'Apply +4 to CHA score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000013', 'Mk 3 Synaptic Accelerator (Strength)',     'augmentation_cybernetic', 17, 375000, 'L', 'brain', 'Apply +6 to STR score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000014', 'Mk 3 Synaptic Accelerator (Dexterity)',    'augmentation_cybernetic', 17, 375000, 'L', 'brain', 'Apply +6 to DEX score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000015', 'Mk 3 Synaptic Accelerator (Constitution)', 'augmentation_cybernetic', 17, 375000, 'L', 'brain', 'Apply +6 to CON score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000016', 'Mk 3 Synaptic Accelerator (Intelligence)', 'augmentation_cybernetic', 17, 375000, 'L', 'brain', 'Apply +6 to INT score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000017', 'Mk 3 Synaptic Accelerator (Wisdom)',       'augmentation_cybernetic', 17, 375000, 'L', 'brain', 'Apply +6 to WIS score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000018', 'Mk 3 Synaptic Accelerator (Charisma)',     'augmentation_cybernetic', 17, 375000, 'L', 'brain', 'Apply +6 to CHA score (update via Ability Scores)'),
  ('ec010000-0000-0000-0000-000000000019', 'Cerebral Countermeasures',                 'augmentation_cybernetic', 8,  9600,   'L', 'brain', NULL),
  -- Eyes
  ('ec010000-0000-0000-0000-000000000020', 'Standard Datajack',                        'augmentation_cybernetic', 1,  150,    'L', 'eyes',  NULL),
  ('ec010000-0000-0000-0000-000000000021', 'High-Density Datajack',                    'augmentation_cybernetic', 5,  3000,   'L', 'eyes',  NULL),
  ('ec010000-0000-0000-0000-000000000022', 'Mk 1 Optical Laser',                       'augmentation_cybernetic', 2,  625,    'L', 'eyes',  NULL),
  ('ec010000-0000-0000-0000-000000000023', 'Mk 2 Optical Laser',                       'augmentation_cybernetic', 7,  5800,   'L', 'eyes',  NULL),
  ('ec010000-0000-0000-0000-000000000024', 'Mk 3 Optical Laser',                       'augmentation_cybernetic', 13, 55000,  'L', 'eyes',  NULL),
  ('ec010000-0000-0000-0000-000000000025', 'Darkvision Capacitors (Basic)',             'augmentation_cybernetic', 5,  3750,   'L', 'eyes',  'Grants darkvision 60 ft (note on sheet)'),
  ('ec010000-0000-0000-0000-000000000026', 'Darkvision Capacitors (Advanced)',          'augmentation_cybernetic', 12, 34250,  'L', 'eyes',  'Grants darkvision 60 ft and low-light vision (note on sheet)'),
  ('ec010000-0000-0000-0000-000000000027', 'Perceptive Lenses (Mk 1)',                  'augmentation_cybernetic', 4,  2000,   'L', 'eyes',  'Apply +2 insight bonus to Perception (add to Perception misc mod)'),
  ('ec010000-0000-0000-0000-000000000028', 'Perceptive Lenses (Mk 2)',                  'augmentation_cybernetic', 9,  13000,  'L', 'eyes',  'Apply +4 insight bonus to Perception (add to Perception misc mod)'),
  ('ec010000-0000-0000-0000-000000000029', 'Perceptive Lenses (Mk 3)',                  'augmentation_cybernetic', 14, 77000,  'L', 'eyes',  'Apply +6 insight bonus to Perception (add to Perception misc mod)'),
  -- Ears
  ('ec010000-0000-0000-0000-000000000030', 'Heartsafe (Basic)',                         'augmentation_cybernetic', 1,  200,    'L', 'ears',  NULL),
  ('ec010000-0000-0000-0000-000000000031', 'Heartsafe (Advanced)',                      'augmentation_cybernetic', 5,  3100,   'L', 'ears',  NULL),
  ('ec010000-0000-0000-0000-000000000032', 'Sonar',                                     'augmentation_cybernetic', 7,  6600,   'L', 'ears',  'Grants blindsense (sound) 30 ft (note on sheet)'),
  -- Throat
  ('ec010000-0000-0000-0000-000000000033', 'Voice Amplifier',                           'augmentation_cybernetic', 1,  100,    'L', 'throat', NULL),
  ('ec010000-0000-0000-0000-000000000034', 'Translator',                                'augmentation_cybernetic', 3,  1500,   'L', 'throat', NULL),
  -- Arms
  ('ec010000-0000-0000-0000-000000000035', 'Mk 1 Prosthetic Arm',                      'augmentation_cybernetic', 1,  100,    '1', 'arm',   NULL),
  ('ec010000-0000-0000-0000-000000000036', 'Mk 2 Prosthetic Arm',                      'augmentation_cybernetic', 5,  2700,   '1', 'arm',   NULL),
  ('ec010000-0000-0000-0000-000000000037', 'Mk 3 Prosthetic Arm',                      'augmentation_cybernetic', 11, 30000,  '1', 'arm',   NULL),
  -- Hands
  ('ec010000-0000-0000-0000-000000000038', 'Tool Arm',                                  'augmentation_cybernetic', 1,  120,    'L', 'hand',  NULL),
  -- Lungs
  ('ec010000-0000-0000-0000-000000000039', 'Standard Speed Suspension',                 'augmentation_cybernetic', 1,  200,    'L', 'lungs', NULL),
  -- Spinal Column
  ('ec010000-0000-0000-0000-000000000040', 'Mk 1 Battle Spine',                        'augmentation_cybernetic', 6,  4200,   'L', 'spinal_column', 'Apply +2 bonus to Initiative (add to Initiative misc mod)'),
  ('ec010000-0000-0000-0000-000000000041', 'Mk 2 Battle Spine',                        'augmentation_cybernetic', 12, 34000,  'L', 'spinal_column', 'Apply +4 bonus to Initiative (add to Initiative misc mod)'),
  ('ec010000-0000-0000-0000-000000000042', 'Mk 3 Battle Spine',                        'augmentation_cybernetic', 18, 440000, 'L', 'spinal_column', 'Apply +6 bonus to Initiative (add to Initiative misc mod)'),
  -- Feet
  ('ec010000-0000-0000-0000-000000000043', 'Mk 1 Prosthetic Leg',                      'augmentation_cybernetic', 1,  100,    '1', 'feet',  NULL),
  ('ec010000-0000-0000-0000-000000000044', 'Mk 2 Prosthetic Leg',                      'augmentation_cybernetic', 5,  2700,   '1', 'feet',  NULL),
  ('ec010000-0000-0000-0000-000000000045', 'Mk 3 Prosthetic Leg',                      'augmentation_cybernetic', 11, 30000,  '1', 'feet',  NULL),
  -- Skin
  ('ec010000-0000-0000-0000-000000000046', 'Mk 1 Dermal Plating',                      'augmentation_cybernetic', 2,  755,    'L', 'skin',  'Apply +1 natural armor bonus to KAC (add to KAC misc mod)'),
  ('ec010000-0000-0000-0000-000000000047', 'Mk 2 Dermal Plating',                      'augmentation_cybernetic', 6,  4520,   'L', 'skin',  'Apply +2 natural armor bonus to KAC (add to KAC misc mod)'),
  ('ec010000-0000-0000-0000-000000000048', 'Mk 3 Dermal Plating',                      'augmentation_cybernetic', 10, 18400,  'L', 'skin',  'Apply +3 natural armor bonus to KAC (add to KAC misc mod)'),
  ('ec010000-0000-0000-0000-000000000049', 'Mk 4 Dermal Plating',                      'augmentation_cybernetic', 14, 88000,  'L', 'skin',  'Apply +4 natural armor bonus to KAC (add to KAC misc mod)'),
  ('ec010000-0000-0000-0000-000000000050', 'Mk 5 Dermal Plating',                      'augmentation_cybernetic', 18, 440000, 'L', 'skin',  'Apply +5 natural armor bonus to KAC (add to KAC misc mod)');
