CREATE TABLE equipment (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  category       equipment_category NOT NULL,
  item_level     integer NOT NULL,
  price          integer NOT NULL,
  bulk           text NOT NULL,
  system         augmentation_system,
  ammo_type      text,
  ammo_capacity  integer,
  bonus_hint     text,
  source_book    text NOT NULL DEFAULT 'crb'
);
