## Why

Characters in Starfinder can acquire and carry multiple pieces of armor over time, but the current model only allows a single equipped armor selected directly from the reference catalog — there is no concept of owned armor inventory. This means characters can't accumulate armor across sessions and the selection model doesn't reflect how the game actually works.

## What Changes

- **BREAKING** Remove `equipped_armor_id` column from the `characters` table
- Add new `character_armor` join table linking characters to armor they own, with a `worn` boolean flag
- Application enforces at most one armor worn per character (toggle worn = unset all others, then set target)
- Replace the single-select `ArmorPicker` combobox with a full inventory list (same UX pattern as weapons)
- "Add Armor" picker opens a searchable combobox filtered by class proficiency
- Each armor row in the inventory has a worn checkbox; checking one unchecks all others
- Worn armor's EAC/KAC bonuses continue to flow into the character stats unchanged

## Capabilities

### New Capabilities

- `character-armor-inventory`: Character owns multiple armor pieces stored in a `character_armor` table; one can be marked `worn` at a time; inventory UI mirrors the weapons inventory pattern

### Modified Capabilities

- `armor-selection`: Requirements change from single equipped_armor_id FK on characters to worn flag on character_armor rows; picker becomes an "Add" action rather than a replace action

## Impact

- `src/db/schema.ts` — remove `equippedArmorId` from `characters`, add `characterArmor` table
- `src/db/queries/characters.ts` — replace equippedArmorId join with character_armor + worn join; add add/remove/toggle-worn queries
- `src/services/characters.ts` — update `updateEquippedArmorForOwner`, add add/remove armor service methods
- `src/app/dashboard/characters/[id]/actions.ts` — replace `updateEquippedArmorAction` with add, remove, toggle-worn actions
- `src/app/dashboard/characters/[id]/_components/armor-picker.tsx` — replaced by new inventory component
- `src/app/dashboard/characters/[id]/_components/inventory-section.tsx` — wire new armor inventory component
- New Drizzle migration required
