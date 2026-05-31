ALTER TABLE "character_race_attribute_values" DROP CONSTRAINT IF EXISTS "character_race_attribute_values_character_id_fk";
ALTER TABLE "character_race_attribute_values" DROP CONSTRAINT IF EXISTS "character_race_attribute_values_attribute_id_fk";
DROP TABLE IF EXISTS "character_race_attribute_values";

ALTER TABLE "race_attributes" DROP CONSTRAINT IF EXISTS "race_attributes_race_id_races_id_fk";
DROP TABLE IF EXISTS "race_attributes";

ALTER TABLE "class_attributes" DROP CONSTRAINT IF EXISTS "class_attributes_class_id_classes_id_fk";
DROP TABLE IF EXISTS "class_attributes";

ALTER TABLE "theme_attributes" DROP CONSTRAINT IF EXISTS "theme_attributes_theme_id_themes_id_fk";
DROP TABLE IF EXISTS "theme_attributes";
