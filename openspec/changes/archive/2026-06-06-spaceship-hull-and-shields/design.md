## Context

The spaceship editor currently tracks frame info, drift rating, and AC/TL defensive scores. Hull points and shields are the primary combat durability stats and are missing. The `spaceships` table uses flat integer columns for all numeric fields (no sub-tables). The UI uses debounced onChange saves (600ms) as the standard save pattern.

## Goals / Non-Goals

**Goals:**
- Add hull point fields (Total, Current, Damage Threshold, Critical Threshold) as manual integer inputs
- Add shield fields (Forward, Port, Starboard, Aft, Regen/min) as manual integer inputs with Shield Total computed client-side
- Render shields in a compass spatial layout
- Persist all new fields via the existing `updateSpaceshipAction` server action

**Non-Goals:**
- Deriving Critical Threshold from Hull Total (stays manual for house-rule flexibility)
- Validating that directional shield values don't exceed a pool total
- Tracking hull/shield history or critical hit log

## Decisions

### Flat columns on `spaceships` (vs separate table)
All existing spaceship numerics are flat columns. Adding 9 more columns stays consistent and avoids a join. A separate table would only be warranted if we needed history or multiple shield load-outs — neither is in scope.

### Shield Total computed client-side (not stored)
Shield Total = fwd + port + stbd + aft. Storing a derived value creates a sync hazard. Computing it in the component from the four directional state values is simpler and always correct.

### All hull fields are manual
Critical Threshold is `hullTotal / 5` in the rules, but manual entry is preferred to allow house-rule overrides. This matches how DT is handled.

### Re-use existing NumField debounce pattern
`_name-editor.tsx` already has a `handleNumChange` / timer-ref pattern for debounced integer fields. The new fields extend the same `NumField` union type and `setters` map rather than introducing a second pattern.

## Risks / Trade-offs

- **Migration adds 9 nullable columns** → Low risk; all default to `0 NOT NULL` so existing rows are unaffected
- **Editor component grows longer** → Acceptable for now; can be split into sub-components later if needed

## Migration Plan

1. Add Supabase migration with 9 new `integer NOT NULL DEFAULT 0` columns on `spaceships`
2. Update `src/db/schema.ts` to match
3. Regenerate or update TypeScript types if needed
4. Update `_name-editor.tsx` with new sections
