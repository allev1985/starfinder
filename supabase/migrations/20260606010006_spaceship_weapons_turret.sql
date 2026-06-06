ALTER TABLE spaceship_weapons
  DROP CONSTRAINT spaceship_weapons_arc_check;

ALTER TABLE spaceship_weapons
  ADD CONSTRAINT spaceship_weapons_arc_check
  CHECK (arc IN ('forward', 'port', 'starboard', 'aft', 'turret'));
