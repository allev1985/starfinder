## Context

The `equipment` table is a reference catalogue used across admin data entry and the character sheet inventory. It currently lacks description text, battery capacity, usage rate, and hands requirements — fields players regularly consult from the rulebook. The `weapons` table already carries `capacity` and `usage`; this change mirrors that pattern on equipment without conflating the two tables.

The popover pattern for descriptions is already established in `conditions-section.tsx` (Info icon + name as trigger, `PopoverContent` with name heading and description body). The character sheet equipment cards (`ShieldCard`, `EquipmentCard`, `ItemCard`) all follow the same `StatCell` pattern for ancillary stats.

## Goals / Non-Goals

**Goals:**
- Add `description`, `capacity`, `usage`, `hands` as nullable columns to the `equipment` table
- Surface description via popover on equipment cards when present
- Show capacity, usage, and hands as `StatCell` entries on cards when non-null
- Admin form fields for all four new columns

**Non-Goals:**
- Merging `ammoCapacity` into the new `capacity` column — they serve different purposes (`ammoCapacity` is the charge count on an ammo item; `capacity` is how much charge energy-using equipment can hold)
- Adding these fields to the `weapons` table (already covered there)
- Category-gating the new fields in the admin form — all four are optional for all categories

## Decisions

**Nullable over non-nullable defaults**
All four columns are nullable. Most existing equipment records won't have descriptions and none need capacity/usage/hands. Default empty strings or zero values would pollute displays; null means "not applicable" and gates rendering on the character sheet.

**Popover only when description is present**
The item name is a plain `<p>` today. When `description` is non-null, it becomes a `PopoverTrigger` wrapping an `Info` icon + the name text. When null, the name stays as plain text. This avoids rendering a non-functional info button for items without descriptions, matching how `bonusHint` is conditionally rendered.

**`hands` as integer (1 or 2) not enum**
An integer is simpler to store, validate, and display. The Starfinder rulebook expresses this as a number. A text enum would add an unnecessary migration step and complicate future edge cases.

**Admin form: no category gate on new fields**
Capacity and usage could theoretically be gated to energy-using categories, but category logic already gates System (augmentations) and AC stats (shields). Adding more gates increases form complexity without strong benefit — the fields are optional and admins understand which items need them.

## Risks / Trade-offs

- **Migration on existing data**: All four columns are nullable with no default, so the migration is purely additive and safe to run with zero downtime. No backfill needed.
- **`EquipmentFormData` type spread**: The existing query file uses a manually-defined `EquipmentFormData` type. Adding four fields requires updating both the type and the `createEquipment`/`updateEquipment` query functions — easy to miss one. The tasks call this out explicitly.
- **Three card types to update**: `ShieldCard`, `EquipmentCard`, and `ItemCard` each need the popover and stat cells. The popover logic is identical across all three; a small shared helper component keeps it DRY.
