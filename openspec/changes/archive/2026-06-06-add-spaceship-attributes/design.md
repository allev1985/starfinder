## Context

The spaceship record already has a substantial schema (hull, shields, AC/TL, crew, weapons, notes) but is missing five fields that appear on the physical Starfinder 1e character sheet: Tier, Maneuverability, Power Core name, Power Core PCU, and Drift Engine name. These are displayed in the "basic info" block of the spaceship editor alongside existing fields like size, frame, and speed.

The existing `driftRating` integer column already captures the numerical drift rating; `driftEngine` (text) will hold the engine's name alongside it.

## Goals / Non-Goals

**Goals:**
- Add five new nullable columns to the `spaceships` table via a single migration
- Surface all five fields in the spaceship editor UI (basic info section)
- Wire new fields through the `updateSpaceshipAction` Pick type

**Non-Goals:**
- Seeding or storing a lookup table of power cores or drift engines
- Computed/derived fields (e.g., auto-calculating PCU budget from allocation)
- Maneuverability constraint enforcement (free text, not an enum)

## Decisions

**All new columns are nullable (no DEFAULT)**
Existing ships have no values for these fields. Defaulting to 0 or "" would be misleading. Nullable means "not yet entered" which is accurate.

**`tier` stored as text, not numeric**
Valid 1e tiers include "1/4", "1/3", "1/2" before integers 1–20. A numeric column can't represent these without a separate encoding. Free text is the honest representation.

**`powerCorePcu` stored as integer, not text**
PCU is always numeric (e.g., 75, 130, 300) and may eventually be used in power budget calculations. Integer preserves that option.

**`maneuverability` stored as text (not enum)**
Five canonical values exist (clumsy/poor/average/good/perfect) but free text matches the pattern of other descriptor fields and avoids a migration if custom values are needed.

**Single migration, no backfill**
All columns are nullable so no backfill is required. Rollback is `ALTER TABLE spaceships DROP COLUMN` for each.

**UI placement: basic info block**
Tier and Maneuverability are ship-level descriptors like Size and Frame. Power Core and Drift Engine are system-level but displayed in the same section for simplicity. Power Core renders as a text+integer pair; Drift Engine renders as text alongside the existing `driftRating` integer.

## Risks / Trade-offs

`_name-editor.tsx` is already 667 lines. Adding five more fields grows it further. → Acceptable for now; the component is one logical unit and there's no spec requiring a split.

## Migration Plan

1. Apply migration adding five nullable columns
2. Deploy — existing rows are unaffected (all NULL)
3. Rollback: drop the five columns (no data loss risk since they're all new)
