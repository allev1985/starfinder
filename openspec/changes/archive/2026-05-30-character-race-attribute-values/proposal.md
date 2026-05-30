## Why

The character sheet currently shows which race a character belongs to but has nowhere to capture the race-specific descriptive fields (Size, Speed, Gender, Home World, etc.) that vary per race. Players need to record and view these details as part of building out their character.

## What Changes

- Add `character_race_attribute_values` table to store user-supplied values keyed to a character + race attribute
- Fetch the character's race attributes (type `description`) on the character detail page
- Render a Description section: editable inline inputs for the owner, read-only display for non-owners
- Auto-save each field value on blur (no save button)

## Capabilities

### New Capabilities

- `character-race-attribute-values`: Persisting and displaying per-character values for race description attributes

### Modified Capabilities

- `character-sheet-attributes`: Character sheet now renders a Description section driven by race attributes

## Impact

- **New migration**: `character_race_attribute_values` table
- **New schema entry**: `characterRaceAttributeValues` in `src/db/schema.ts`
- **New queries**: upsert + fetch in `src/db/queries/characters.ts` (or a new `race-attribute-values.ts`)
- **New server action**: upsert a single attribute value
- **New component**: `DescriptionSection` on the character detail page
- **Modified page**: `src/app/dashboard/characters/[id]/page.tsx` wires in the new section
