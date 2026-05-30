## Why

The character sheet needs to know what fields to show based on a character's race, class, and theme. Different races have different traits, classes have different features, and themes have different knowledge abilities — the app must drive this from data, not hardcoded UI. These tables define the *structure* of the sheet; the player fills in all values from their rulebook.

## What Changes

- Add `race_attributes` table — defines the fields that appear on the sheet for each race
- Add `class_attributes` table — defines the fields that appear on the sheet for each class
- Add `theme_attributes` table — defines the fields that appear on the sheet for each theme
- Seed all three tables via Drizzle SQL migration with full CRB data (8 races, 7 classes, 10 themes)
- No UI changes — this change is data model only; character sheet rendering is a follow-on change

## Capabilities

### New Capabilities

- `character-sheet-attributes`: Three attribute definition tables (race, class, theme) with a shared shape — type, name, input_type, description, sort_order — seeded with CRB data. Together they define what fields any race+class+theme combination produces on a character sheet.

### Modified Capabilities

*(none)*

## Impact

- **DB schema**: Three new tables (`race_attributes`, `class_attributes`, `theme_attributes`)
- **Drizzle migrations**: New migration for tables + full CRB seed data
- **Queries**: New query functions to fetch attributes by race/class/theme ID
- **No page or action changes** in this change
