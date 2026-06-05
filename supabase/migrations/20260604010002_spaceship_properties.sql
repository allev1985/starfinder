ALTER TABLE spaceships
  ADD COLUMN make_and_model text,
  ADD COLUMN speed text,
  ADD COLUMN size text,
  ADD COLUMN frame text,
  ADD COLUMN drift_rating integer NOT NULL DEFAULT 0;
