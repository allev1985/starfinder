ALTER TABLE character_combat_stats
  ADD COLUMN melee_attack_misc_mod  INT NOT NULL DEFAULT 0,
  ADD COLUMN ranged_attack_misc_mod INT NOT NULL DEFAULT 0,
  ADD COLUMN thrown_attack_misc_mod INT NOT NULL DEFAULT 0;
