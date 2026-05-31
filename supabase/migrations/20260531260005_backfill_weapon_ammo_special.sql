-- Backfill ammo_type for seeded special weapons.
-- Melee (basic/advanced) and grenades remain null.
-- Special ranged weapons get appropriate ammo types.

UPDATE weapons SET ammo_type = 'shells' WHERE id IN (
  'b8000000-0000-0000-0000-000000000001', -- Flare Gun
  'b8000000-0000-0000-0000-000000000002', -- Stickybomb Launcher
  'b8000000-0000-0000-0000-000000000005', -- Riot Grenade Launcher
  'b8000000-0000-0000-0000-000000000006', -- Net Launcher, Tactical
  'b8000000-0000-0000-0000-000000000012', -- Reaction Cannon, Light
  'b8000000-0000-0000-0000-000000000013'  -- Reaction Cannon, Heavy
);

UPDATE weapons SET ammo_type = 'darts' WHERE id IN (
  'b8000000-0000-0000-0000-000000000003', -- Needler, Tactical
  'b8000000-0000-0000-0000-000000000004'  -- Needler, Advanced
);

UPDATE weapons SET ammo_type = 'heavy_rounds' WHERE id IN (
  'b8000000-0000-0000-0000-000000000007', -- Seeker Rifle
  'b8000000-0000-0000-0000-000000000008', -- Rail Gun, Tactical
  'b8000000-0000-0000-0000-000000000009'  -- Rail Gun, Advanced
);

UPDATE weapons SET ammo_type = 'battery' WHERE id IN (
  'b8000000-0000-0000-0000-000000000010', -- Wave Modulator, Mk 1
  'b8000000-0000-0000-0000-000000000011'  -- Wave Modulator, Mk 2
);

-- melee_basic, melee_advanced, grenade categories: ammo_type remains NULL (no update needed)
