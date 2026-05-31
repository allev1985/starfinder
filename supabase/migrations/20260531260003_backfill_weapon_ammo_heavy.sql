-- Backfill ammo_type for seeded heavy weapons.
-- Flamethrowers → petrochem_fuel; energy/plasma/laser/zero → battery; gyrojet → heavy_rounds.

UPDATE weapons SET ammo_type = 'petrochem_fuel' WHERE id IN (
  'b3000000-0000-0000-0000-000000000001', -- Flamethrower, Tactical
  'b3000000-0000-0000-0000-000000000006', -- Flamethrower, Advanced
  'b3000000-0000-0000-0000-000000000020'  -- Flamethrower, Incendiary
);

UPDATE weapons SET ammo_type = 'battery' WHERE id IN (
  'b3000000-0000-0000-0000-000000000002', -- Acid Cannon, Tactical
  'b3000000-0000-0000-0000-000000000003', -- Plasma Cannon, Red Star
  'b3000000-0000-0000-0000-000000000004', -- Mining Laser
  'b3000000-0000-0000-0000-000000000007', -- Laser Cannon, Azimuth
  'b3000000-0000-0000-0000-000000000008', -- Laser Cannon, Corona
  'b3000000-0000-0000-0000-000000000009', -- Zero Cannon, Frostbite
  'b3000000-0000-0000-0000-000000000010', -- Plasma Cannon, White Star
  'b3000000-0000-0000-0000-000000000012', -- Laser Cannon, Zenith
  'b3000000-0000-0000-0000-000000000013', -- Plasma Cannon, Blue Star
  'b3000000-0000-0000-0000-000000000014', -- Zero Cannon, Hailstorm
  'b3000000-0000-0000-0000-000000000015', -- Laser Cannon, Aphelion
  'b3000000-0000-0000-0000-000000000016', -- Plasma Cannon, Stellar
  'b3000000-0000-0000-0000-000000000017', -- Zero Cannon, Blizzard
  'b3000000-0000-0000-0000-000000000018', -- Laser Cannon, Perihelion
  'b3000000-0000-0000-0000-000000000019'  -- Acid Cannon, Advanced
);

UPDATE weapons SET ammo_type = 'heavy_rounds' WHERE id IN (
  'b3000000-0000-0000-0000-000000000005', -- Gyrojet Cannon, Tactical
  'b3000000-0000-0000-0000-000000000011'  -- Gyrojet Cannon, Advanced
);
