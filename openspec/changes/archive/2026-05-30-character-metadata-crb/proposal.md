## Why

Characters currently have only a name — there is no concept of race, class, or theme. Adding CRB reference metadata tables and wiring them to character creation is the first step toward a functional character sheet that can drive stat calculations, skill lists, and features.

## What Changes

- Add three reference tables seeded with CRB data: `races` (8 entries), `classes` (7 entries), `themes` (10 entries)
- Add `race_id`, `class_id`, `theme_id` FK columns to the `characters` table
- Update character creation form to require race, class, and theme selection via dropdowns
- Update character detail page to display race, class, and theme
- Update character edit page to allow changing race, class, and theme

## Capabilities

### New Capabilities

- `crb-reference-data`: Reference tables for CRB races, classes, and themes — seeded via Drizzle SQL migration, used as FK targets on the characters table
- `character-class-race-theme`: Character creation and editing includes required race, class, and theme selection; character detail displays all three

### Modified Capabilities

- `character-management`: Character creation now requires race, class, and theme; detail page shows these fields; edit page allows updating them

## Impact

- **DB schema**: New tables `races`, `classes`, `themes`; new FK columns on `characters`
- **Drizzle migrations**: New migration for tables + seed data
- **Server actions**: `createCharacterAction` and `updateCharacterAction` gain race/class/theme fields
- **Queries**: Character queries updated to join/return race, class, theme names
- **Pages**: `/dashboard/characters/new`, `/dashboard/characters/[id]`, `/dashboard/characters/[id]/edit`
