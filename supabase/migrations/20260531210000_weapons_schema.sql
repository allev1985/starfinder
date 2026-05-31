-- weapon_category enum and weapons reference table
CREATE TYPE weapon_category AS ENUM (
  'small_arms',
  'longarms',
  'heavy',
  'sniper',
  'melee_basic',
  'melee_advanced',
  'grenade',
  'special'
);

CREATE TABLE weapons (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  item_level    integer NOT NULL,
  category      weapon_category NOT NULL,
  damage_dice   text NOT NULL,
  damage_types  text[] NOT NULL,
  critical_effect text,
  critical_dice text,
  range         text,
  capacity      integer,
  usage         integer,
  bulk          text NOT NULL,
  special       text,
  source_book   text NOT NULL DEFAULT 'crb'
);
