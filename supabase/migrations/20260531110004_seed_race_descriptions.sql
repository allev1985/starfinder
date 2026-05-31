-- Humanoid description fields
INSERT INTO "race_descriptions" ("id", "race_type", "name", "sort_order") VALUES
  ('f1000000-0000-0000-0000-000000000001', 'biological', 'Size',          1),
  ('f1000000-0000-0000-0000-000000000002', 'biological', 'Walking Speed', 2),
  ('f1000000-0000-0000-0000-000000000003', 'biological', 'Running Speed', 3),
  ('f1000000-0000-0000-0000-000000000004', 'biological', 'Gender',        4),
  ('f1000000-0000-0000-0000-000000000005', 'biological', 'Home World',    5),
  ('f1000000-0000-0000-0000-000000000006', 'biological', 'Alignment',     6),
  ('f1000000-0000-0000-0000-000000000007', 'biological', 'Deity',         7);

-- Android description fields
INSERT INTO "race_descriptions" ("id", "race_type", "name", "sort_order") VALUES
  ('f2000000-0000-0000-0000-000000000001', 'android', 'Chassis Type', 1),
  ('f2000000-0000-0000-0000-000000000002', 'android', 'Size',         2),
  ('f2000000-0000-0000-0000-000000000003', 'android', 'Land Speed',   3),
  ('f2000000-0000-0000-0000-000000000004', 'android', 'Fly Speed',    4),
  ('f2000000-0000-0000-0000-000000000005', 'android', 'Climb Speed',  5);
