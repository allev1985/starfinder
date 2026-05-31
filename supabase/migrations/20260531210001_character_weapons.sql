-- character_weapons join table: links characters to their carried weapons
CREATE TABLE character_weapons (
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  weapon_id    uuid NOT NULL REFERENCES weapons(id),
  PRIMARY KEY (character_id, weapon_id)
);
