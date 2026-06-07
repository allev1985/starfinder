## Why

The character sheet has no place to record freeform proficiencies, special abilities, or general notes that fall outside of class features, theme features, and feats. Players need a lightweight way to capture these character-specific details without rigid structure.

## What Changes

- Add a `character_notes` DB table with a `type` column (`'ability' | 'proficiency' | 'note'`) and a `content` text column
- Add three new sections to the character sheet: **Abilities**, **Proficiencies**, and **Notes**
- Each section renders entries of its type with add/remove interactions (owner only)
- Sections appear in the "Abilities & Gear" tab (desktop) and the "Abilities & Gear" accordion (mobile)

## Capabilities

### New Capabilities

- `character-note-sections`: Freeform text entry sections on the character sheet, backed by a typed `character_notes` table, covering ability, proficiency, and note types

### Modified Capabilities

- `character-sheet-tabs`: The "Abilities & Gear" tab gains three new sections

## Impact

- **DB schema**: New `character_notes` table (migration required)
- **Queries**: New query in `src/db/queries/characters.ts` to load notes by character
- **Server actions**: Add/remove actions in the character `actions.ts`
- **Character context**: New `notes` state (array, typed)
- **Components**: New `CharacterNotesSection` component (parameterized by type), rendered three times
- **Page loader**: `loadCharacterSheetData` extended to fetch notes
- **`character-stats-client.tsx`**: Passes notes down to the sheet
