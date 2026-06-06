## Why

The spaceship sheet is missing several foundational 1e Starfinder attributes — Tier, Maneuverability, Power Core, and Drift Engine — that players reference constantly during starship combat and travel. Without them, the sheet is incomplete for actual play.

## What Changes

- Add `tier` (text) to the spaceship — stores values like "1/4", "1/2", "1", "10"
- Add `maneuverability` (text) to the spaceship — free-text entry (e.g., "average", "good")
- Add `powerCoreName` (text) and `powerCorePcu` (integer) — manual entry, no seeded lookup
- Add `driftEngine` (text) — the engine's name, pairs with existing `driftRating` integer
- Surface all five new fields in the spaceship editor UI (basic info section)

## Capabilities

### New Capabilities
- `spaceship-core-attributes`: Tier, Maneuverability, Power Core (name + PCU), and Drift Engine fields on the spaceship record

### Modified Capabilities
- `campaign-spaceship`: UI gains five new inputs in the basic info block

## Impact

- `src/db/schema.ts` — five new nullable columns on `spaceships` table
- `supabase/migrations/` — one new migration
- `src/db/queries/campaigns.ts` — `updateSpaceship` already accepts `Partial<Spaceship>`, no change needed
- `src/app/dashboard/campaigns/[id]/spaceship/actions.ts` — `updateSpaceshipAction` Pick type expanded
- `src/app/dashboard/campaigns/[id]/spaceship/_name-editor.tsx` — new fields wired into `TEXT_FIELDS` and new PCU numeric field
