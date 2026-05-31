## Why

Characters carry more than weapons and armor — augmentations, personal upgrades, and ammunition are mechanically significant items that affect stats and play. Without an equipment inventory, players have no structured way to track these on their sheet or know which manual modifier updates to make.

## What Changes

- Add an `equipment` reference table seeded with all CRB augmentations (cybernetic and biotech), personal upgrades (Mk 1/2/3), and all ammunition types
- Add a `character_equipment` instance table linking characters to equipment items with a quantity field
- Add an `ammo_type` nullable column to the `weapons` table; backfill all seeded weapons with their correct ammo type
- Add an Equipment subsection to the Inventory section on the character sheet, showing augmentations/upgrades and ammunition separately
- Where equipment carries a mechanical bonus, display a visible hint callout on the item card so the owner knows which misc mod field to update — no automatic stat derivation
- Weapon cards gain an "Uses: [ammo type]" badge when `ammo_type` is set

## Capabilities

### New Capabilities

- `equipment-reference-data`: `equipment` reference table schema, category/system enums, seed migrations for augmentations (cybernetic + biotech), personal upgrades, and all CRB ammunition types
- `character-equipment-inventory`: `character_equipment` instance table; UI component for adding/removing equipment items with quantity support; amber bonus hint callout on items with `bonus_hint` set

### Modified Capabilities

- `weapon-reference-data`: `weapons` table gains a nullable `ammo_type` column; all seeded weapons are backfilled with their ammo type
- `inventory-section`: Inventory section gains a third subsection "Equipment" (below Weapons) containing augmentations/upgrades and ammunition grouped separately

## Impact

- New DB migrations: `equipment` table, `character_equipment` table, `ammo_type` column on `weapons`, seed files (augmentations cybernetic, augmentations biotech, personal upgrades, ammunition)
- `src/db/schema.ts` — new tables + updated `weapons` type export
- `src/db/queries/characters.ts` — new queries for character equipment
- `src/app/dashboard/characters/[id]/_components/inventory-section.tsx` — adds Equipment subsection
- New component: `equipment-inventory.tsx`
- Character sheet page loader needs to fetch equipment reference data and character equipment
