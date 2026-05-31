CREATE TABLE character_equipment (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  equipment_id uuid NOT NULL REFERENCES equipment(id),
  quantity     integer NOT NULL DEFAULT 1
);
