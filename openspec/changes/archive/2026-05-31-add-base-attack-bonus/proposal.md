## Why

Characters in Starfinder need a Base Attack Bonus (BAB) value to calculate attack rolls. This field is currently missing from the character sheet, leaving players unable to record this core combat stat.

## What Changes

- Add a `base_attack_bonus` integer field to the character data model
- Add a user-editable BAB input to the character sheet combat stats section

## Capabilities

### New Capabilities

_(none — this extends existing capabilities)_

### Modified Capabilities

- `character-combat-stats`: Add `base_attack_bonus` as a user-input field alongside existing combat stats

## Impact

- `characters` table — new `base_attack_bonus` column (integer, default 0)
- Character combat stats UI component — new input field
- Character data types — updated to include the new field
