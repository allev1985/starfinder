-- Stats sourced from Archives of Nethys (aonprd.com) Starfinder 1e CRB

CREATE TYPE armor_type AS ENUM ('light', 'heavy', 'powered');

CREATE TABLE armor (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  type                armor_type NOT NULL,
  item_level          INTEGER NOT NULL,
  price               INTEGER NOT NULL,
  eac_bonus           INTEGER NOT NULL,
  kac_bonus           INTEGER NOT NULL,
  max_dex_bonus       INTEGER,
  armor_check_penalty INTEGER NOT NULL DEFAULT 0,
  speed_adjustment    INTEGER NOT NULL DEFAULT 0,
  bulk                TEXT NOT NULL,
  upgrade_slots       INTEGER NOT NULL DEFAULT 0,
  source_book         TEXT NOT NULL DEFAULT 'crb'
);
