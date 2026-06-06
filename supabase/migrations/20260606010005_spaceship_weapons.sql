CREATE TABLE spaceship_weapons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spaceship_id uuid NOT NULL REFERENCES spaceships(id) ON DELETE CASCADE,
  arc text NOT NULL CHECK (arc IN ('forward', 'port', 'starboard', 'aft')),
  name text NOT NULL,
  damage text,
  range text,
  special text,
  created_at timestamptz NOT NULL DEFAULT now()
);
