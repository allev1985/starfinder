## Context

The `equipment_category` Postgres enum currently has 5 values: `augmentation_cybernetic`, `augmentation_biotech`, `personal_upgrade`, `ammunition`, `shield`. The character equipment inventory and admin CRUD are hardcoded to these categories.

The picker dialog uses a horizontal tab bar (`all | shields | augmentations | ammunition`) to filter the command list. With 10 total categories this approach breaks down — the bar becomes unusable on mobile and the filter logic grows unwieldy.

The existing table has nullable columns for category-specific data (`system`, `ammoType`, `ammoCapacity`, `eacBonus`, `kacBonus`, `acPenalty`, `maxDexBonus`). The five new categories do not require any additional columns — `name`, `itemLevel`, `price`, `bulk`, and optionally `bonusHint` are sufficient for pack-tracking purposes.

## Goals / Non-Goals

**Goals:**
- Add `computer`, `magic_item`, `trap`, `technological`, `personal` to the `equipment_category` enum
- Show a new **Items** section in the character inventory for items of any new category
- Replace the tab-based picker filter with a grouped command list that scales to any number of categories
- Support all new categories in the admin equipment CRUD form

**Non-Goals:**
- No stat or calculation impact — new categories are inventory-tracking only
- No new table columns (the existing columns cover all new category needs)
- No seed data for the new categories (admin can add items manually)
- Computers do not get a full tier/module system; they are treated as simple inventory items

## Decisions

### 1. Enum names: `personal` not `personal_item`

Using `personal` keeps the value short and consistent with the user's intent. The potential confusion with `personal_upgrade` is managed by display labels in the UI ("Personal Items" vs "Personal Upgrade"), not by the enum value itself.

### 2. No new columns

All five new categories only need base fields: name, level, price, bulk. The existing `bonusHint` text field covers any freeform notes (e.g., a magic item's effect description). Adding new columns would add schema complexity with no functional benefit at this stage.

`technological` items that use batteries can reuse `ammoCapacity`/`ammoType` — but this is optional and left to the data entry admin, not enforced by the schema.

### 3. Picker dialog: grouped CommandGroup, no tabs

**Decision**: Remove the `FilterTab` state and tab bar. Replace with `CommandGroup` headings, one per category, rendered in a logical order. Search filters across all groups automatically via the existing `CommandInput`.

**Why over a dropdown filter**: A dropdown still requires UI interaction to narrow results. The grouped list + search gives the user both at once — they can scan by category or type to filter. It's also simpler code (no `pickerFilter` state).

**Category display order in picker**:
1. Shields
2. Augmentations (cybernetic + biotech + personal upgrades grouped under one heading)
3. Ammunition
4. Computers
5. Technological
6. Magic Items
7. Traps
8. Personal Items

### 4. Inventory sections: add a single "Items" section

The three existing sections (Shields, Augmentations & Upgrades, Ammunition) keep their specialized UX intact. All five new categories render in a new **Items** section using a simplified card: name, level, category label, price, bulk — remove button only. No charge controls, no wielded toggle.

### 5. `categoryLabel` in EquipmentCard

The existing `categoryLabel` switch falls through to `"Ammunition"` for unknown categories. This will be replaced with a proper lookup object covering all 10 categories.

## Risks / Trade-offs

- **Postgres enum addition is not transactional in some configs** → Supabase migrations handle this fine; `ADD VALUE` is safe in isolation. No rollback concern since we're only adding, not renaming or removing.
- **Admin form category select grows to 10 items** → Acceptable; a `<Select>` dropdown with 10 options is standard. No redesign needed for the admin form.
- **`technological` items that use batteries: no charge tracking** → By design (non-goal). If this becomes needed later, the columns already exist and a new category-specific card can be added.

## Migration Plan

1. Apply Supabase migration: `ALTER TYPE equipment_category ADD VALUE` for each of the 5 new values
2. Deploy app — no data migration needed, no existing rows affected
3. Rollback: not needed (additive enum change); if required, remove any rows with new category values and drop/recreate the enum (destructive, avoid)
