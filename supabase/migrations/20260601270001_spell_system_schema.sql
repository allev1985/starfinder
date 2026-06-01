-- spell_school enum
CREATE TYPE spell_school AS ENUM (
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
  'universal'
);

-- spells reference table
CREATE TABLE spells (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL UNIQUE,
  school         spell_school NOT NULL,
  casting_time   text NOT NULL,
  range          text NOT NULL,
  area           text,
  targets        text,
  duration       text NOT NULL,
  saving_throw   text,
  spell_resist   text,
  description    text NOT NULL,
  damage         text,
  damage_note    text,
  source         text NOT NULL DEFAULT 'CRB'
);

-- spell_class junction table
CREATE TABLE spell_class (
  spell_id    uuid NOT NULL REFERENCES spells(id),
  class_id    uuid NOT NULL REFERENCES classes(id),
  spell_level integer NOT NULL,
  PRIMARY KEY (spell_id, class_id)
);

-- character_spells table
CREATE TABLE character_spells (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  spell_id     uuid NOT NULL REFERENCES spells(id),
  spell_level  integer NOT NULL,
  UNIQUE (character_id, spell_id)
);

-- character_spell_slots table (levels 1-6 only; level 0 cantrips are at-will)
CREATE TABLE character_spell_slots (
  character_id uuid    NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  spell_level  integer NOT NULL,
  total_slots  integer NOT NULL DEFAULT 0,
  used_slots   integer NOT NULL DEFAULT 0,
  PRIMARY KEY (character_id, spell_level)
);

-- is_spellcaster flag on classes
ALTER TABLE classes ADD COLUMN is_spellcaster boolean NOT NULL DEFAULT false;
