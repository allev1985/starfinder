-- Add shield as an equipment category
ALTER TYPE equipment_category ADD VALUE IF NOT EXISTS 'shield';

-- Add shield proficiency flag to classes table
ALTER TABLE classes ADD COLUMN IF NOT EXISTS shield_proficiency boolean NOT NULL DEFAULT false;

-- Add shield stat columns to equipment (nullable, category-specific)
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS eac_bonus integer;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS kac_bonus integer;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS ac_penalty integer;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS max_dex_bonus integer;

-- Add wielded state to character_equipment (false by default, inert for non-shields)
ALTER TABLE character_equipment ADD COLUMN IF NOT EXISTS wielded boolean NOT NULL DEFAULT false;

-- Add shield proficiency flag to feats
ALTER TABLE feats ADD COLUMN IF NOT EXISTS is_shield_proficiency boolean NOT NULL DEFAULT false;
