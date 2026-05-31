ALTER TABLE character_combat_stats
  ADD COLUMN eac_armor_bonus INT NOT NULL DEFAULT 0,
  ADD COLUMN eac_misc_mod    INT NOT NULL DEFAULT 0,
  ADD COLUMN kac_armor_bonus INT NOT NULL DEFAULT 0,
  ADD COLUMN kac_misc_mod    INT NOT NULL DEFAULT 0;
