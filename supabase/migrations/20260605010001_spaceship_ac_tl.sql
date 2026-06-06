ALTER TABLE spaceships
  ADD COLUMN pilot_rank integer NOT NULL DEFAULT 0,
  ADD COLUMN size_mod integer NOT NULL DEFAULT 0,
  ADD COLUMN armor_bonus integer NOT NULL DEFAULT 0,
  ADD COLUMN ac_misc_mod integer NOT NULL DEFAULT 0,
  ADD COLUMN countermeasures integer NOT NULL DEFAULT 0,
  ADD COLUMN tl_misc_mod integer NOT NULL DEFAULT 0;
