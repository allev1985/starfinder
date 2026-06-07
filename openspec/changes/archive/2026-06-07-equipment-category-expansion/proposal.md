## Why

The equipment inventory currently only supports augmentations, personal upgrades, ammunition, and shields. Players need to track a much wider range of gear — computers, magic items, traps, technological items, and personal items — all of which exist in the Starfinder CRB but have no home in the sheet today.

## What Changes

- Add 5 new values to the `equipment_category` Postgres enum: `computer`, `magic_item`, `trap`, `technological`, `personal`
- Add a new **Items** section to the character equipment inventory for all new category types
- Redesign the equipment picker dialog to replace the non-scalable tab bar with a grouped command list (items grouped by category under headings, search filters across all groups)
- Update the admin equipment CRUD UI to include the new categories
- Update category label display logic throughout the UI

## Capabilities

### New Capabilities

- `equipment-category-expansion`: Five new equipment category enum values with supporting UI — picker dialog redesign, new inventory section, and admin support

### Modified Capabilities

- `admin-equipment-crud`: Admin form now supports the five new category values (no new required fields; the new categories use only the base columns)
- `character-equipment-inventory`: Inventory gains a new "Items" section and the picker dialog is redesigned from tabs to a grouped command list
- `equipment-reference-data`: Enum extended with five new values; no column changes

## Impact

- **DB migration**: `ALTER TYPE equipment_category ADD VALUE` for each new type (additive, no data migration needed)
- **Drizzle schema**: `equipmentCategory` enum updated in `src/db/schema.ts`
- **Admin UI**: `src/app/dashboard/admin/data/[editionSlug]/equipment/_equipment-client.tsx`
- **Character sheet UI**: `src/app/dashboard/characters/[id]/_components/equipment-inventory.tsx`
- **No calculation impact**: New categories are inventory-tracking only; no AC, attack, or stat derivations are affected
