## 1. Database

- [x] 1.1 Write Supabase migration adding 9 new `integer NOT NULL DEFAULT 0` columns to `spaceships`: `hull_total`, `hull_current`, `damage_threshold`, `critical_threshold`, `shield_forward`, `shield_port`, `shield_starboard`, `shield_aft`, `shield_regen_per_min`
- [x] 1.2 Update `src/db/schema.ts` `spaceships` table with the 9 new camelCase fields matching the migration

## 2. UI — Hull Points Section

- [x] 2.1 Extend `NumField` type in `_name-editor.tsx` to include the 4 hull fields: `hullTotal`, `hullCurrent`, `damageThreshold`, `criticalThreshold`
- [x] 2.2 Add state, setters, and timer refs for the 4 hull fields following the existing `NumField` debounce pattern
- [x] 2.3 Render a Hull Points section below Defensive Scores with four inputs in a 2×2 grid: Total, Current, DT, CT

## 3. UI — Shields Section

- [x] 3.1 Extend `NumField` type to include the 5 shield fields: `shieldForward`, `shieldPort`, `shieldStarboard`, `shieldAft`, `shieldRegenPerMin`
- [x] 3.2 Add state, setters, and timer refs for the 5 shield fields
- [x] 3.3 Compute `shieldTotal` client-side as the sum of the four directional shield state values
- [x] 3.4 Render a Shields section with a compass layout: Forward centered top, Port left, Starboard right, Aft centered bottom, with Shield Total (read-only) and Regen/min below
