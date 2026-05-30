## Why

Characters have no concept of level, making the sheet useless for tracking progression. Level is one of the most frequently updated values in active play — it needs to be immediately accessible on the detail page, not buried in an edit form.

## What Changes

- Add `level` integer column (NOT NULL, DEFAULT 1) to the `characters` table
- Character detail page displays level for all authorized viewers
- Owner sees inline − / + controls to decrement/increment level without leaving the page
- Level is clamped to 1–20 (Starfinder 1e max) and validated server-side
- No changes to the character edit form — level is managed exclusively via the inline control

## Capabilities

### New Capabilities

- `character-level`: Level column on characters, displayed and inline-editable on the detail page

### Modified Capabilities

- `character-management`: Character detail page content now includes level display and owner-only inline level control

## Impact

- **DB schema**: New `level` column on `characters`
- **Drizzle migration**: Add column with default 1
- **Server action**: New `updateCharacterLevelAction` in the character detail route
- **Queries**: `updateCharacter` updated to support level; `getCharacterWithCampaigns` returns level
- **Pages**: `/dashboard/characters/[id]` gains level display + inline control component
