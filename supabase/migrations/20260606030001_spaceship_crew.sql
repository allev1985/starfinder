CREATE TABLE spaceship_crew (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spaceship_id uuid NOT NULL REFERENCES spaceships(id) ON DELETE CASCADE,
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX spaceship_crew_singleton_role
  ON spaceship_crew (spaceship_id, role)
  WHERE role IN ('captain', 'pilot');
