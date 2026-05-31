## MODIFIED Requirements

### Requirement: character_combat_stats table
The database SHALL have a `character_combat_stats` table with `character_id` as its primary key (referencing `characters.id`), an `initiative_misc_mod` integer column NOT NULL with a default of `0`, a `base_attack_bonus` integer column NOT NULL with a default of `0`, and six additional integer columns for health and resolve: `stamina_points_total`, `stamina_points_current`, `hit_points_total`, `hit_points_current`, `resolve_points_total`, `resolve_points_current` — all NOT NULL with a default of `0`.

#### Scenario: Table structure
- **WHEN** all migrations have run
- **THEN** `character_combat_stats` exists with columns `character_id UUID PK`, `initiative_misc_mod INT NOT NULL DEFAULT 0`, `base_attack_bonus INT NOT NULL DEFAULT 0`, `stamina_points_total INT NOT NULL DEFAULT 0`, `stamina_points_current INT NOT NULL DEFAULT 0`, `hit_points_total INT NOT NULL DEFAULT 0`, `hit_points_current INT NOT NULL DEFAULT 0`, `resolve_points_total INT NOT NULL DEFAULT 0`, `resolve_points_current INT NOT NULL DEFAULT 0`

#### Scenario: Backfill on migration
- **WHEN** the base_attack_bonus migration runs against a database with existing `character_combat_stats` rows
- **THEN** the `base_attack_bonus` column is present with value `0` on every existing row

### Requirement: Combat stats row created with character
A `character_combat_stats` row SHALL be inserted atomically when a new character is created, with all columns at their defaults including `base_attack_bonus = 0`.

#### Scenario: New character has combat stats row
- **WHEN** a new character is created
- **THEN** a `character_combat_stats` row exists for that character with `base_attack_bonus = 0` and all other columns at their defaults

## ADDED Requirements

### Requirement: Base Attack Bonus is owner-editable
The character owner SHALL be able to update `base_attack_bonus` via the character sheet. The value is persisted to `character_combat_stats` using the debounced onChange pattern (600 ms).

#### Scenario: Owner saves base attack bonus
- **WHEN** the owner edits the base attack bonus field
- **THEN** the new value is persisted after the 600 ms debounce without additional user action

#### Scenario: Non-owner sees read-only base attack bonus
- **WHEN** a non-owner views the character sheet
- **THEN** the base attack bonus is displayed as static text with no editable input

### Requirement: Base Attack Bonus displayed in Combat Stats section
The Combat Stats section SHALL include a row displaying the Base Attack Bonus field below the initiative row.

#### Scenario: BAB row visible on character sheet
- **WHEN** a character detail page loads
- **THEN** the Combat Stats section shows a Base Attack Bonus row with an editable input (owner) or static text (non-owner)
