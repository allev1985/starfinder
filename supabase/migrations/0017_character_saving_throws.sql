ALTER TABLE character_combat_stats
  ADD COLUMN fort_base_save INT NOT NULL DEFAULT 0,
  ADD COLUMN fort_misc_mod  INT NOT NULL DEFAULT 0,
  ADD COLUMN ref_base_save  INT NOT NULL DEFAULT 0,
  ADD COLUMN ref_misc_mod   INT NOT NULL DEFAULT 0,
  ADD COLUMN will_base_save INT NOT NULL DEFAULT 0,
  ADD COLUMN will_misc_mod  INT NOT NULL DEFAULT 0;
