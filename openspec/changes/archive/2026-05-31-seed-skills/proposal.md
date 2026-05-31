## Why

The app has no skills data — there's no `skills` table, no `class_skills` join table, and no seed data. Without this, the character sheet cannot display or track skill ranks, which are a core part of every Starfinder character.

## What Changes

- Add a `skills` table to the DB schema with columns: `id`, `name`, `ability`, `trained_only`, `armor_check_penalty`
- Add a `class_skills` join table linking `skills` ↔ `classes` (the existing seeded table)
- Seed all 20 Starfinder CRB skills with correct ability, trained_only, and armor_check_penalty values
- Seed all `class_skills` rows for the 7 CRB classes (Envoy, Mechanic, Mystic, Operative, Solarian, Soldier, Technomancer)

## Capabilities

### New Capabilities

- `skills-reference-data`: The skills and class_skills reference tables and their seed data

### Modified Capabilities

<!-- none -->

## Impact

- `src/db/schema.ts` — two new tables (`skills`, `class_skills`)
- `supabase/migrations/` — new migration file for DDL + seed data
