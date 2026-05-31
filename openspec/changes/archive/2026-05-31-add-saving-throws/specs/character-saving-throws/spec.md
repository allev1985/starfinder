## ADDED Requirements

### Requirement: Saving throw columns in character_combat_stats
The `character_combat_stats` table SHALL have six new integer columns, all NOT NULL with a default of `0`: `fort_base_save`, `fort_misc_mod`, `ref_base_save`, `ref_misc_mod`, `will_base_save`, `will_misc_mod`.

#### Scenario: Table structure after migration
- **WHEN** all migrations have run
- **THEN** `character_combat_stats` has columns `fort_base_save INT NOT NULL DEFAULT 0`, `fort_misc_mod INT NOT NULL DEFAULT 0`, `ref_base_save INT NOT NULL DEFAULT 0`, `ref_misc_mod INT NOT NULL DEFAULT 0`, `will_base_save INT NOT NULL DEFAULT 0`, `will_misc_mod INT NOT NULL DEFAULT 0`

#### Scenario: Existing rows after migration
- **WHEN** the saving throws migration runs against a database with existing `character_combat_stats` rows
- **THEN** all six new columns are present with value `0` on every existing row

### Requirement: Saving throw totals are derived and never stored
Each saving throw total SHALL equal `baseSave + abilityModifier + miscMod` where `abilityModifier = modifier(score)` from `src/lib/ability.ts`. Totals SHALL NOT be stored in the database.

#### Scenario: Fortitude total
- **WHEN** a character has `con_score = 14`, `fort_base_save = 3`, `fort_misc_mod = 1`
- **THEN** the Fortitude total displayed is `+6`

#### Scenario: Reflex total with negative modifier
- **WHEN** a character has `dex_score = 8`, `ref_base_save = 2`, `ref_misc_mod = 0`
- **THEN** the Reflex total displayed is `+1`

#### Scenario: Will total
- **WHEN** a character has `wis_score = 10`, `will_base_save = 0`, `will_misc_mod = 0`
- **THEN** the Will total displayed is `+0`

### Requirement: Saving throws section displayed on character sheet
The character sheet SHALL display a Saving Throws sub-grid inside `CombatStatsSection` with rows for Fortitude, Reflex, and Will. Each row SHALL show: the save name, derived total (signed string), Base Save input, read-only Ability Mod (labeled with source ability), and Misc input.

#### Scenario: Section visible to all viewers
- **WHEN** any user views the character sheet
- **THEN** the Saving Throws sub-grid is visible with Fortitude, Reflex, and Will rows

#### Scenario: Ability mod labels
- **WHEN** the Saving Throws section is displayed
- **THEN** the ability modifier column for Fortitude is labeled "CON Mod", Reflex "DEX Mod", Will "WIS Mod"

#### Scenario: Total updates when ability score changes
- **WHEN** the owner changes the CON ability score
- **THEN** the Fortitude total in the Saving Throws section reflects the updated CON modifier

### Requirement: Base Save and Misc are owner-editable with debounced save
The character owner SHALL be able to edit Base Save and Misc Mod for each saving throw. Changes SHALL be persisted automatically via debounced onChange (600 ms), consistent with the pattern in `ability-scores-section.tsx`.

#### Scenario: Owner edits base save
- **WHEN** the owner changes a Base Save input
- **THEN** the new value is persisted within 600 ms without additional user action

#### Scenario: Non-owner sees read-only values
- **WHEN** a non-owner views the character sheet
- **THEN** Base Save and Misc inputs are displayed as static text with no editable inputs
