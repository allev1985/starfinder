ALTER TABLE character_combat_stats
  ADD COLUMN stamina_points_total INT NOT NULL DEFAULT 0,
  ADD COLUMN stamina_points_current INT NOT NULL DEFAULT 0,
  ADD COLUMN hit_points_total INT NOT NULL DEFAULT 0,
  ADD COLUMN hit_points_current INT NOT NULL DEFAULT 0,
  ADD COLUMN resolve_points_total INT NOT NULL DEFAULT 0,
  ADD COLUMN resolve_points_current INT NOT NULL DEFAULT 0;
