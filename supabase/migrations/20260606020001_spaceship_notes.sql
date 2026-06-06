CREATE TABLE spaceship_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spaceship_id uuid NOT NULL REFERENCES spaceships(id) ON DELETE CASCADE,
  section text NOT NULL,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
