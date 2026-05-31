-- CRB powered armor. Stats sourced from Archives of Nethys (aonprd.com).
-- Powered armor requires the Powered Armor Proficiency feat (not a class proficiency).
-- No class_armor_proficiency rows exist for 'powered' until feat modeling is added.

INSERT INTO armor (id, name, type, item_level, price, eac_bonus, kac_bonus, max_dex_bonus, armor_check_penalty, speed_adjustment, bulk, upgrade_slots) VALUES
  ('a2300000-0000-0000-0000-000000000001', 'Marauder',   'powered', 9,  120000,  14, 16, 0, -4, -10, '35', 4),
  ('a2300000-0000-0000-0000-000000000002', 'Titan Armor', 'powered', 20, 1000000, 28, 30, 0, -6, -10, '40', 6);
