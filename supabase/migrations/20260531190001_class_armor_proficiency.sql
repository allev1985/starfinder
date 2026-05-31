CREATE TABLE class_armor_proficiency (
  class_id   UUID NOT NULL REFERENCES classes(id),
  armor_type armor_type NOT NULL,
  PRIMARY KEY (class_id, armor_type)
);
