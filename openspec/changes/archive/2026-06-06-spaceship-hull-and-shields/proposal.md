## Why

The spaceship sheet is missing hull points and shield tracking — the core combat durability stats every crew needs during ship combat. Without them the sheet can't be used as a live combat tracker.

## What Changes

- Add four hull point fields to the spaceship record: Total, Current, Damage Threshold, Critical Threshold (all manual integer entry)
- Add five shield fields: Forward, Port, Starboard, Aft (all manual integer entry), and Regen/min (manual integer entry)
- Display Shield Total as a computed read-only value (sum of the four directional shields)
- Add a Hull Points section and a Shields section to the spaceship editor UI, below the existing Defensive Scores section
- Shield inputs are arranged in a spatial compass layout (FWD top, PORT left, STBD right, AFT bottom)

## Capabilities

### New Capabilities

- `spaceship-hull-points`: Hull Points section with Total, Current, Damage Threshold, and Critical Threshold manual inputs
- `spaceship-shields`: Shields section with four directional manual inputs, computed Shield Total, and Regen/min input arranged in compass layout

### Modified Capabilities

- `campaign-spaceship`: The spaceship record now stores hull and shield fields — the requirement for what the record captures is expanding

## Impact

- `src/db/schema.ts` — 9 new integer columns on `spaceships` table
- New Supabase migration
- `src/app/dashboard/campaigns/[id]/spaceship/_name-editor.tsx` — two new UI sections
- `src/app/dashboard/campaigns/[id]/spaceship/actions.ts` — no changes needed (generic `updateSpaceshipAction` already accepts partial updates)
