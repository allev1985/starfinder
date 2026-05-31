-- CRB biotech augmentations. Stats sourced from Archives of Nethys (aonprd.com).
-- Columns: id, name, category, item_level, price, bulk, system, ammo_type, ammo_capacity, bonus_hint, source_book

INSERT INTO equipment (id, name, category, item_level, price, bulk, system, bonus_hint) VALUES
  -- Brain
  ('ec020000-0000-0000-0000-000000000001', 'Mk 1 Cerebral Casing',               'augmentation_biotech', 4,  2250,  'L', 'brain', NULL),
  ('ec020000-0000-0000-0000-000000000002', 'Mk 2 Cerebral Casing',               'augmentation_biotech', 8,  9500,  'L', 'brain', NULL),
  ('ec020000-0000-0000-0000-000000000003', 'Mk 3 Cerebral Casing',               'augmentation_biotech', 12, 34500, 'L', 'brain', NULL),
  -- Eyes
  ('ec020000-0000-0000-0000-000000000004', 'Regenerative Blood (Mk 1)',           'augmentation_biotech', 2,  750,   'L', 'eyes',  NULL),
  ('ec020000-0000-0000-0000-000000000005', 'Regenerative Blood (Mk 2)',           'augmentation_biotech', 8,  9250,  'L', 'eyes',  NULL),
  -- Ears
  ('ec020000-0000-0000-0000-000000000006', 'Acoustic Dampener',                   'augmentation_biotech', 1,  275,   'L', 'ears',  NULL),
  -- Throat
  ('ec020000-0000-0000-0000-000000000007', 'Reactive Skin',                       'augmentation_biotech', 2,  810,   'L', 'throat', NULL),
  -- Arms
  ('ec020000-0000-0000-0000-000000000008', 'Mk 1 Muscular Suture',                'augmentation_biotech', 2,  750,   'L', 'arm',   'Apply +2 bonus to Athletics checks (add to Athletics misc mod)'),
  ('ec020000-0000-0000-0000-000000000009', 'Mk 2 Muscular Suture',                'augmentation_biotech', 6,  4200,  'L', 'arm',   'Apply +4 bonus to Athletics checks (add to Athletics misc mod)'),
  ('ec020000-0000-0000-0000-000000000010', 'Mk 3 Muscular Suture',                'augmentation_biotech', 10, 17900, 'L', 'arm',   'Apply +6 bonus to Athletics checks (add to Athletics misc mod)'),
  -- Hands
  ('ec020000-0000-0000-0000-000000000011', 'Climbing Suckers',                    'augmentation_biotech', 1,  200,   'L', 'hand',  'Grants a climb speed of 20 ft (note on sheet)'),
  ('ec020000-0000-0000-0000-000000000012', 'Swimming Fins',                       'augmentation_biotech', 1,  200,   'L', 'hand',  'Grants a swim speed of 20 ft (note on sheet)'),
  -- Lungs
  ('ec020000-0000-0000-0000-000000000013', 'Gill Sheath',                         'augmentation_biotech', 1,  275,   'L', 'lungs', 'Grants water breathing (note on sheet)'),
  ('ec020000-0000-0000-0000-000000000014', 'Rebreather',                          'augmentation_biotech', 2,  250,   'L', 'lungs', NULL),
  -- Spinal Column
  ('ec020000-0000-0000-0000-000000000015', 'Tail (Prehensile)',                   'augmentation_biotech', 3,  1625,  'L', 'spinal_column', NULL),
  ('ec020000-0000-0000-0000-000000000016', 'Tail (Venom)',                        'augmentation_biotech', 7,  6500,  'L', 'spinal_column', NULL),
  -- Feet
  ('ec020000-0000-0000-0000-000000000017', 'Mk 1 Speed Suspension (Biotech)',     'augmentation_biotech', 4,  2150,  'L', 'feet',  'Apply +10 ft to land speed (note on sheet)'),
  ('ec020000-0000-0000-0000-000000000018', 'Mk 2 Speed Suspension (Biotech)',     'augmentation_biotech', 8,  9400,  'L', 'feet',  'Apply +20 ft to land speed (note on sheet)'),
  ('ec020000-0000-0000-0000-000000000019', 'Mk 3 Speed Suspension (Biotech)',     'augmentation_biotech', 14, 78000, 'L', 'feet',  'Apply +30 ft to land speed (note on sheet)'),
  -- Skin
  ('ec020000-0000-0000-0000-000000000020', 'Adaptive Metabolism',                 'augmentation_biotech', 5,  3150,  'L', 'skin',  NULL),
  ('ec020000-0000-0000-0000-000000000021', 'Camouflage Skin',                     'augmentation_biotech', 6,  4300,  'L', 'skin',  'Apply +4 bonus to Stealth in specific terrain (add to Stealth misc mod when applicable)'),
  ('ec020000-0000-0000-0000-000000000022', 'Regulated Nervous System',            'augmentation_biotech', 4,  2050,  'L', 'skin',  NULL);
