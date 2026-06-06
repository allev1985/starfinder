## Why

Starfinder combat tracks critical damage conditions on ship systems, but the sheet has no way to record this state. Players and DMs currently have to track Glitching / Malfunctioning / Wrecked conditions off-sheet, which breaks flow during combat.

## What Changes

- Add a **Critical Damage** section to the spaceship editor with damage status buttons for Life Support and Sensors.
- Extend the **Weapons** section with damage status buttons for Engines, Power Core, and each weapons arc (Forward, Port, Starboard, Aft).
- Each status control is a single-select button group: `None` · `Glitching` · `Malfunctioning` · `Wrecked`.
- Eight new nullable text columns added to the `spaceships` table to persist each status.

## Capabilities

### New Capabilities

- `spaceship-critical-damage`: Tracks damage condition (Glitching / Malfunctioning / Wrecked) for Life Support, Sensors, Engines, Power Core, and the four weapons arcs (Forward, Port, Starboard, Aft).

### Modified Capabilities

- `spaceship-weapons`: Arc damage status (Glitching / Malfunctioning / Wrecked) is added per firing arc (Forward, Port, Starboard, Aft only — Turret excluded). This is arc-level, not per-weapon.

## Impact

- `src/db/schema.ts` — 8 new columns on `spaceships` table
- New Drizzle migration
- `src/app/dashboard/campaigns/[id]/spaceship/actions.ts` — `updateSpaceshipAction` already accepts partial updates; no change needed
- `src/app/dashboard/campaigns/[id]/spaceship/_name-editor.tsx` — new UI sections and state
- `openspec/specs/spaceship-weapons/spec.md` — updated to include arc damage requirement
