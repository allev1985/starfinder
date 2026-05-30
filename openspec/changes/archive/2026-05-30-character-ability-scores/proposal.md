## Why

Character sheets are incomplete without ability scores — STR, DEX, CON, INT, WIS, and CHA are the foundation of nearly every Starfinder mechanic. Players need a place to record and view their final ability scores and derived modifiers.

## What Changes

- Add 6 integer columns to the `characters` table (`str_score`, `dex_score`, `con_score`, `int_score`, `wis_score`, `cha_score`), each defaulting to 10
- Add an Ability Scores section to the character sheet page, always visible regardless of race
- Owners see editable score inputs; non-owners see read-only values
- Modifier is derived client-side (`floor((score - 10) / 2)`) and displayed inline — not stored
- Auto-save on blur; no explicit save button required

## Capabilities

### New Capabilities

- `character-ability-scores`: Player-entered ability scores (STR/DEX/CON/INT/WIS/CHA) with inline derived modifiers on the character sheet

### Modified Capabilities

## Impact

- `src/db/schema.ts` — 6 new columns on `characters` table
- `src/db/queries/characters.ts` — new update query for ability scores
- `src/services/characters.ts` — new service function with ownership check
- `src/app/dashboard/characters/[id]/actions.ts` — new server action
- `src/app/dashboard/characters/[id]/page.tsx` — render new section
- New component: `src/app/dashboard/characters/[id]/_components/ability-scores-section.tsx`
- New Supabase migration
