## Context

The spaceship editor stores all ship state as flat columns on the `spaceships` table. Critical damage conditions (Glitching / Malfunctioning / Wrecked) from Starfinder combat are not tracked anywhere. Life Support and Sensors belong in a dedicated Critical Damage section; Engines, Power Core, and per-arc weapons damage belong in the Weapons section.

## Goals / Non-Goals

**Goals:**
- Persist damage status for 8 systems: Life Support, Sensors, Engines, Power Core, Forward arc, Port arc, Starboard arc, Aft arc.
- Single-select button group UI (None / Glitching / Malfunctioning / Wrecked) for each system.
- Debounced auto-save consistent with existing spaceship fields (600ms).

**Non-Goals:**
- Turret arc damage tracking (excluded by design — Starfinder rules don't apply critical damage to turrets separately).
- Per-weapon damage tracking (damage is arc-level, not individual weapon-level).
- Read-only mode differentiation (out of scope for this change).

## Decisions

### Flat columns on `spaceships` table (vs. JSONB blob)

8 new nullable `text` columns: `life_support_damage`, `sensors_damage`, `engines_damage`, `power_core_damage`, `weapons_forward_damage`, `weapons_port_damage`, `weapons_starboard_damage`, `weapons_aft_damage`.

Values: `null` (undamaged), `"glitching"`, `"malfunctioning"`, `"wrecked"`.

**Why flat over JSONB:** The rest of the table is flat. Flat columns are type-safe in Drizzle, individually addressable in queries, and consistent with how shields (8 columns) are already modelled. JSONB would add complexity for no benefit at this scale.

### Button group over checkboxes

Single-select button group renders as `[None] [Glitching] [Malfunctioning] [Wrecked]`. Clicking the active state returns to `None`.

**Why:** The three conditions are mutually exclusive escalating severity levels. Checkboxes imply independent boolean states, which misrepresents the game rule and invites accidental multi-selection. Button groups make the exclusive-choice semantics self-evident.

### Save strategy: immediate server action (no debounce needed)

Button group clicks are discrete user events, not keystrokes. Each click fires `updateSpaceshipAction` immediately — no debounce timer needed, unlike text/number inputs.

### UI placement

- **Critical Damage** section: new `border-t pt-5` section after the Shields block, before the Weapons block. Contains Life Support and Sensors.
- **Weapons** section: Engines and Power Core rows added at the top of the existing Weapons block. Arc damage button group rendered below each arc's weapon list.

## Risks / Trade-offs

- [Migration adds 8 nullable columns] → All default to `null` (undamaged). No data loss, no backfill needed. Safe to roll back by dropping columns.
- [No optimistic UI for button group] → Server action is fast; the state updates after the action resolves. Acceptable for this use case — not a high-frequency interaction.

## Migration Plan

1. Add Drizzle migration with 8 `ALTER TABLE spaceships ADD COLUMN` statements.
2. Deploy schema change (all nullable, no default needed beyond null).
3. Ship UI — no data migration required.

Rollback: drop the 8 columns; no application state affected.
