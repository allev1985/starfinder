ALTER TABLE characters
  ADD COLUMN equipped_armor_id UUID REFERENCES armor(id);

ALTER TABLE character_combat_stats
  DROP COLUMN eac_armor_bonus,
  DROP COLUMN kac_armor_bonus;
