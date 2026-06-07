## 1. Database Schema & Migration

- [x] 1.1 Add `description` (text, nullable), `capacity` (integer, nullable), `usage` (integer, nullable), `hands` (integer, nullable) columns to the `equipment` table in `src/db/schema.ts`
- [x] 1.2 Generate and run the Drizzle migration for the four new columns

## 2. Admin Queries

- [x] 2.1 Add `description`, `capacity`, `usage`, and `hands` to `EquipmentFormData` in `src/db/queries/admin-equipment.ts`
- [x] 2.2 Update `createEquipment` and `updateEquipment` to include the four new fields in their insert/update payloads

## 3. Admin Form UI

- [x] 3.1 Add `description`, `capacity`, `usage`, `hands` to `EMPTY_FORM` in `_equipment-client.tsx`
- [x] 3.2 Add a full-width `Textarea` for Description to the modal form (import `Textarea` from `@/components/ui/textarea`)
- [x] 3.3 Add number `Input` fields for Capacity, Usage, and Hands to the modal form (all optional)
- [x] 3.4 Update `openEdit` to pre-fill all four new fields from the existing equipment record

## 4. Character Sheet — Description Popover

- [x] 4.1 In `equipment-inventory.tsx`, extract a small `ItemName` helper that renders a plain name when description is null, or a `Popover` (Info icon + name as trigger, name heading + description body as content) when non-null
- [x] 4.2 Replace the plain `<p className="text-sm font-semibold">{e.name}</p>` with `<ItemName>` in `ShieldCard`
- [x] 4.3 Replace the plain name `<p>` with `<ItemName>` in `EquipmentCard`
- [x] 4.4 Replace the plain name `<p>` with `<ItemName>` in `ItemCard`

## 5. Character Sheet — Stat Cells

- [x] 5.1 Add a `StatCell` for Hands (value `e.hands`) rendered conditionally when `e.hands != null` in `ShieldCard`
- [x] 5.2 Add conditional `StatCell` entries for Capacity, Usage, and Hands in `EquipmentCard`
- [x] 5.3 Add conditional `StatCell` entries for Capacity, Usage, and Hands in `ItemCard`

## 6. Lint & Type Check

- [x] 6.1 Run `npm run lint` and resolve any errors
- [x] 6.2 Run `npx tsc --noEmit` and resolve any type errors
