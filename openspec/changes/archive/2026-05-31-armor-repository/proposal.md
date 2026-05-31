## Why

Characters currently type EAC and KAC armor bonuses manually with no connection to actual armor, and the DEX modifier applied to armor class is uncapped — both are calculation errors that only a real armor repository can fix. Adding a searchable armor catalog filtered by class proficiency gives the sheet mechanical correctness and removes the need for players to look up and transcribe stats by hand.

## What Changes

- **NEW** `armor_type` enum (`light | heavy | powered`) added to the database schema
- **NEW** `armor` reference table with all CRB armor pieces (light, heavy, and powered), seeded via migration; stats sourced from Archives of Nethys
- **NEW** `class_armor_proficiency` join table mapping each class to the armor types it can use, seeded for all 7 CRB classes (consistent with `class_skills` pattern)
- **NEW** `equipped_armor_id` nullable FK column on `characters` referencing `armor.id`
- **BREAKING** `eac_armor_bonus` and `kac_armor_bonus` dropped from `character_combat_stats` — armor bonus is now derived from the equipped armor row
- **FIX** DEX modifier applied to EAC/KAC is now capped by the equipped armor's `max_dex_bonus` (currently uncapped, which is mechanically incorrect)
- **NEW** Armor picker combobox on the character sheet (combat stats section), filtered to only armor types the character's class is proficient with
- **NEW** Read-only armor stat strip below the AC grid showing Max DEX | ACP | Speed | Bulk | Upgrade Slots
- Powered armor is seeded but excluded from the class proficiency filter until feats are modeled

## Capabilities

### New Capabilities

- `armor-repository`: CRB armor reference table, class proficiency table, seed data, and query functions
- `armor-selection`: Character equips armor from a filtered combobox; EAC/KAC bonuses and DEX cap flow from the selected armor row

### Modified Capabilities

- `character-armor-class`: EAC and KAC bonus is now derived from equipped armor (not editable); DEX modifier is capped by `max_dex_bonus`; armor bonus inputs replaced by read-only display
- `crb-reference-data`: New `armor` and `class_armor_proficiency` tables added to the CRB reference dataset

## Impact

- **Schema**: Two new tables, one new enum, one new FK on `characters`, two dropped columns on `character_combat_stats`
- **Migrations**: DDL migration + CRB armor seed migration (~42 rows) + class proficiency seed migration (~13 rows)
- **Server actions**: `updateEacArmorBonusAction` and `updateKacArmorBonusAction` removed; `updateEquippedArmorAction` added
- **Queries**: `reference.ts` gains armor lookup functions; character queries join equipped armor
- **UI**: `combat-stats-section.tsx` gains armor combobox and stat strip; armor bonus column shifts from editable input to read-only display
- **No new dependencies** — combobox built from existing shadcn Command + Popover primitives
