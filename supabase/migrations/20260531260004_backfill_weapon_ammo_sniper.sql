-- Backfill ammo_type for seeded sniper weapons.
-- Ballistic sniper rifles → sniper_rounds; laser sniper rifles → battery.

UPDATE weapons SET ammo_type = 'sniper_rounds' WHERE id IN (
  'b4000000-0000-0000-0000-000000000001', -- Semi-Auto Rifle, Tactical
  'b4000000-0000-0000-0000-000000000002', -- Sniper Rifle, Hunting
  'b4000000-0000-0000-0000-000000000004', -- Semi-Auto Rifle, Advanced
  'b4000000-0000-0000-0000-000000000005', -- Sniper Rifle, Elite
  'b4000000-0000-0000-0000-000000000007', -- Semi-Auto Rifle, Suppressor
  'b4000000-0000-0000-0000-000000000008', -- Void Sniper Rifle
  'b4000000-0000-0000-0000-000000000010', -- Semi-Auto Rifle, Paragon
  'b4000000-0000-0000-0000-000000000012'  -- Void Sniper Rifle, Advanced
);

UPDATE weapons SET ammo_type = 'battery' WHERE id IN (
  'b4000000-0000-0000-0000-000000000003', -- Laser Rifle, Sniper
  'b4000000-0000-0000-0000-000000000006', -- Laser Rifle, Sniper Advanced
  'b4000000-0000-0000-0000-000000000009', -- Laser Rifle, Sniper Superior
  'b4000000-0000-0000-0000-000000000011'  -- Laser Rifle, Sniper Paragon
);
