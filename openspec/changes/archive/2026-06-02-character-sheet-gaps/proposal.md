## Why

The character sheet is missing four fields present on the official Starfinder PDF sheet that players actively use during play: DR/Resistances (derived from worn armor), Credits (currency), XP Earned (progression), and Languages (known tongues). Without these, players must track critical game information off-sheet.

## What Changes

- Add `dr` and `resistances` text fields to the `armor` table; display them read-only in the Armor Class section when armor is worn
- Add `credits` integer field to the `characters` table; editable in the gear tab with debounced save
- Add `xp_earned` integer field to the `characters` table; editable on the sheet with debounced save
- Add `languages` text array field to the `characters` table; rendered as a tag list with add/remove in the gear tab

## Capabilities

### New Capabilities

- `character-credits`: Track and edit a character's credit balance on the character sheet
- `character-xp`: Track and edit a character's XP earned on the character sheet
- `character-languages`: Track a character's known languages as a tag list on the character sheet

### Modified Capabilities

- `character-armor-class`: Display DR and Resistances derived from the equipped armor
- `character-armor-inventory`: Armor records now carry `dr` and `resistances` fields visible in the armor detail

## Impact

- `src/db/schema.ts` — new columns on `armor` and `characters` tables
- DB migrations via Supabase MCP
- `src/db/queries/characters.ts` — extend queries to return new fields
- `src/app/dashboard/characters/[id]/_components/combat-stats-section.tsx` — render DR/Resistances
- `src/app/dashboard/characters/[id]/_components/equipment-inventory.tsx` — add Credits field
- `src/app/dashboard/characters/[id]/_components/character-stats-client.tsx` — wire new props
- New components: `credits-section.tsx`, `xp-section.tsx`, `languages-section.tsx`
- New server actions for credits, XP, and languages saves
