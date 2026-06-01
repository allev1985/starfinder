DROP TABLE IF EXISTS character_spell_slots;

CREATE TABLE class_spell_progression (
  class_id        uuid    NOT NULL REFERENCES classes(id),
  character_level integer NOT NULL,
  spell_level     integer NOT NULL,
  spells_known    integer NOT NULL,
  PRIMARY KEY (class_id, character_level, spell_level)
);
