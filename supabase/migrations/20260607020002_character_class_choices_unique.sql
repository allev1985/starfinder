CREATE UNIQUE INDEX IF NOT EXISTS "character_class_choices_unique"
  ON "character_class_choices" ("character_id", "class_ability_id", "acquired_at_level");
