## Why

The app is currently hardwired to Starfinder 1st Edition — reference data, character mechanics, and campaign structure all implicitly assume 1e. Adding an edition layer now costs little (one new table, FK columns, a backfill) and avoids a painful retrofit when Starfinder 2e support is eventually needed.

## What Changes

- New `editions` table with a single seed row (`1e`) as the canonical edition identifier
- `edition_id` FK column added to `characters` and `campaigns` (edition-locked; a campaign and all its characters share one edition)
- `edition_id` FK column added to all reference tables: `weapons`, `armor`, `skills`, `classes`, `themes`, `races`, `feats`, `spells`, `chassis`, `class_abilities`, `theme_abilities`, `race_descriptions`
- All existing rows backfilled to `1e`
- "New character" and "new campaign" forms accept an edition value (defaulting to `1e`; no picker UI needed until 2e exists)
- Character sheet route branches on `character.edition` so a future 2e sheet can be wired in without touching the 1e sheet

## Capabilities

### New Capabilities

- `edition-registry`: The `editions` table and the concept of edition as a first-class FK across characters, campaigns, and reference data

### Modified Capabilities

- `db-schema`: New `editions` table; `edition_id` columns on characters, campaigns, and all reference tables
- `db-migrations`: New migration to create `editions`, add `edition_id` FKs, and backfill existing rows
- `crb-reference-data`: All seeded reference rows must carry `edition_id = <1e uuid>`
- `character-management`: Character creation and edit flows set `edition_id` (default `1e`)
- `create-campaign`: Campaign creation sets `edition_id` (default `1e`)

## Impact

- `src/db/schema.ts` — new `editions` table; `edition_id` added to ~12 tables
- `supabase/migrations/` — one new migration
- `src/app/dashboard/characters/new/` — `edition_id` passed through on create
- `src/app/dashboard/campaigns/new/` — `edition_id` passed through on create
- `src/app/dashboard/characters/[id]/page.tsx` — edition branch point for future sheet routing
- Seed scripts / reference data loaders — must resolve the `1e` edition UUID before inserting
