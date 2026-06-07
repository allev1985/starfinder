## Why

Equipment items on the character sheet lack description text, capacity, usage, and hands fields — information players regularly reference from the rulebook. Adding these fields keeps all relevant item data in one place and surfaces it naturally via the existing popover pattern.

## What Changes

- Add four nullable columns to the `equipment` table: `description`, `capacity`, `usage`, `hands`
- Admin equipment form gains a textarea for description and number inputs for capacity, usage, and hands
- Character sheet equipment cards display description via a name-triggered popover (Info icon + item name) when a description is present; capacity, usage, and hands appear as stat cells when non-null

## Capabilities

### New Capabilities

- `equipment-item-details`: Description, capacity, usage, and hands fields on equipment items — authored in admin, rendered on the character sheet

### Modified Capabilities

- `admin-equipment-crud`: Form gains description (textarea), capacity, usage, and hands inputs
- `character-equipment-inventory`: Equipment cards gain description popover and additional stat cells

## Impact

- `src/db/schema.ts` — four new nullable columns on `equipment`
- New DB migration
- `src/db/queries/admin-equipment.ts` — `EquipmentFormData` and queries updated
- `src/app/dashboard/admin/data/[editionSlug]/equipment/_equipment-client.tsx` — admin form fields
- `src/app/dashboard/characters/[id]/_components/equipment-inventory.tsx` — card popover and stat cells
