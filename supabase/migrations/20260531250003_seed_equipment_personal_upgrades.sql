-- CRB personal upgrades. Stats sourced from Archives of Nethys (aonprd.com).
-- Columns: id, name, category, item_level, price, bulk, system, ammo_type, ammo_capacity, bonus_hint, source_book

INSERT INTO equipment (id, name, category, item_level, price, bulk, bonus_hint) VALUES
  ('ec030000-0000-0000-0000-000000000001', 'Personal Upgrade (Mk 1)', 'personal_upgrade', 1,  1400,   'L', 'Apply +2 to one ability score of your choice (update via Ability Scores)'),
  ('ec030000-0000-0000-0000-000000000002', 'Personal Upgrade (Mk 2)', 'personal_upgrade', 5,  27000,  'L', 'Apply +4 to one ability score of your choice (update via Ability Scores)'),
  ('ec030000-0000-0000-0000-000000000003', 'Personal Upgrade (Mk 3)', 'personal_upgrade', 11, 405000, 'L', 'Apply +6 to one ability score of your choice (update via Ability Scores)');
