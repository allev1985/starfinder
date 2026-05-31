## Why

Characters need a weapon inventory to track the weapons they carry. Without it, the character sheet has no way to record what weapons a character owns, making it impossible to reference weapon stats during play or build out a combat-ready character.

## What Changes

- **New**: `weapons` reference table seeded with all CRB weapons (name, level, category, damage dice, damage types, critical effect, critical dice, range, capacity, usage, bulk, special)
- **New**: `character_weapons` join table linking characters to their carried weapons
- **New**: Inventory section on the character sheet housing both Armor and Weapons as separate subsections
- **Modified**: Armor picker moved from the combat section into the new Inventory section
- **New**: Weapon picker — searchable combobox to add weapons to inventory; stat cards showing all weapon fields for each carried weapon

## Capabilities

### New Capabilities

- `weapon-reference-data`: CRB weapons reference table schema and seed migrations (all weapon categories)
- `character-weapons`: Character weapon inventory — join table, queries, server actions, and UI (weapon picker + stat cards)
- `inventory-section`: New Inventory section on the character sheet combining armor and weapons; armor picker relocated here

### Modified Capabilities

- `armor-selection`: Armor picker moved from combat section to the new Inventory section (UI relocation only, no requirement change)

## Impact

- `src/db/schema.ts` — new `weaponCategory` enum, `weapons` table, `character_weapons` table
- `supabase/migrations/` — new migration for schema + seed migrations per weapon category
- `src/db/queries/` — new `weapons.ts` query file (list all weapons, get character weapons, add/remove)
- `src/app/dashboard/characters/[id]/` — new `_components/inventory-section.tsx`, new `_components/weapon-picker.tsx`, relocated armor picker
- `src/app/dashboard/characters/[id]/actions.ts` — add/remove weapon server actions
- `src/app/dashboard/characters/[id]/page.tsx` — wire inventory section, pass weapon data
