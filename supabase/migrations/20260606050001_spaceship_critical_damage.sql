ALTER TABLE spaceships
  ADD COLUMN IF NOT EXISTS life_support_damage text,
  ADD COLUMN IF NOT EXISTS sensors_damage text,
  ADD COLUMN IF NOT EXISTS engines_damage text,
  ADD COLUMN IF NOT EXISTS power_core_damage text,
  ADD COLUMN IF NOT EXISTS weapons_forward_damage text,
  ADD COLUMN IF NOT EXISTS weapons_port_damage text,
  ADD COLUMN IF NOT EXISTS weapons_starboard_damage text,
  ADD COLUMN IF NOT EXISTS weapons_aft_damage text;
