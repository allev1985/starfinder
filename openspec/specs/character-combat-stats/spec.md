## ADDED Requirements

### Requirement: character_combat_stats table
The database SHALL have a `character_combat_stats` table with `character_id` as its primary key (referencing `characters.id`), an `initiative_misc_mod` integer column NOT NULL with a default of `0`, a `base_attack_bonus` integer column NOT NULL with a default of `0`, six integer columns for health and resolve (`stamina_points_total`, `stamina_points_current`, `hit_points_total`, `hit_points_current`, `resolve_points_total`, `resolve_points_current` — all NOT NULL DEFAULT 0), four integer columns for armor class (`eac_armor_bonus`, `eac_misc_mod`, `kac_armor_bonus`, `kac_misc_mod` — all NOT NULL DEFAULT 0), and six integer columns for saving throws (`fort_base_save`, `fort_misc_mod`, `ref_base_save`, `ref_misc_mod`, `will_base_save`, `will_misc_mod` — all NOT NULL DEFAULT 0).

#### Scenario: Table structure
- **WHEN** all migrations have run
- **THEN** `character_combat_stats` exists with columns `character_id UUID PK`, `initiative_misc_mod INT NOT NULL DEFAULT 0`, `base_attack_bonus INT NOT NULL DEFAULT 0`, `stamina_points_total INT NOT NULL DEFAULT 0`, `stamina_points_current INT NOT NULL DEFAULT 0`, `hit_points_total INT NOT NULL DEFAULT 0`, `hit_points_current INT NOT NULL DEFAULT 0`, `resolve_points_total INT NOT NULL DEFAULT 0`, `resolve_points_current INT NOT NULL DEFAULT 0`, `eac_armor_bonus INT NOT NULL DEFAULT 0`, `eac_misc_mod INT NOT NULL DEFAULT 0`, `kac_armor_bonus INT NOT NULL DEFAULT 0`, `kac_misc_mod INT NOT NULL DEFAULT 0`, `fort_base_save INT NOT NULL DEFAULT 0`, `fort_misc_mod INT NOT NULL DEFAULT 0`, `ref_base_save INT NOT NULL DEFAULT 0`, `ref_misc_mod INT NOT NULL DEFAULT 0`, `will_base_save INT NOT NULL DEFAULT 0`, `will_misc_mod INT NOT NULL DEFAULT 0`

#### Scenario: Backfill on migration
- **WHEN** the armor class migration runs against a database with existing `character_combat_stats` rows
- **THEN** the four AC columns are present with value `0` on every existing row

### Requirement: Combat stats row created with character
A `character_combat_stats` row SHALL be inserted atomically when a new character is created, with all columns at their defaults including all four armor class columns at `0`.

#### Scenario: New character has combat stats row
- **WHEN** a new character is created
- **THEN** a `character_combat_stats` row exists for that character with `eac_armor_bonus = 0`, `eac_misc_mod = 0`, `kac_armor_bonus = 0`, `kac_misc_mod = 0`, and all other columns at their defaults

### Requirement: Initiative misc modifier is owner-editable
The character owner SHALL be able to update `initiative_misc_mod` via the character sheet. The value is persisted to `character_combat_stats`.

#### Scenario: Owner saves misc modifier
- **WHEN** the owner edits the initiative misc modifier and moves focus away
- **THEN** the new value is persisted without additional user action

#### Scenario: Non-owner sees read-only misc modifier
- **WHEN** a non-owner views the character sheet
- **THEN** the initiative misc modifier is displayed as static text with no editable input

### Requirement: Initiative total is derived and displayed
The character sheet SHALL display an Initiative total equal to `floor((dexScore - 10) / 2) + initiativeMiscMod`. The total SHALL NOT be stored in the database.

#### Scenario: Initiative total reflects DEX score
- **WHEN** a character has `dex_score = 14` and `initiative_misc_mod = 0`
- **THEN** the initiative total displayed is `+2`

#### Scenario: Initiative total reflects misc modifier
- **WHEN** a character has `dex_score = 14` and `initiative_misc_mod = 4`
- **THEN** the initiative total displayed is `+6`

#### Scenario: Initiative total updates when DEX score changes
- **WHEN** the owner changes the DEX ability score
- **THEN** the initiative total shown in Combat Stats reflects the updated DEX modifier

### Requirement: modifier() exported from src/lib/ability.ts
A `modifier(score: number): number` function SHALL be exported from `src/lib/ability.ts`, returning `Math.floor((score - 10) / 2)`. The function returns a raw integer; display formatting (leading `+`) is the caller's responsibility.

#### Scenario: Positive modifier
- **WHEN** `modifier(14)` is called
- **THEN** the return value is `2`

#### Scenario: Zero modifier
- **WHEN** `modifier(10)` is called
- **THEN** the return value is `0`

#### Scenario: Negative modifier
- **WHEN** `modifier(8)` is called
- **THEN** the return value is `-1`

### Requirement: Combat Stats section on character sheet
The character detail page SHALL render a **Combat Stats** section below the Ability Scores section. It SHALL display initiative with columns for Total, DEX Modifier, and Misc modifier.

#### Scenario: Section always visible
- **WHEN** a character detail page loads
- **THEN** the Combat Stats section is visible regardless of race, class, or theme selection

#### Scenario: Initiative row layout
- **WHEN** the Combat Stats section renders
- **THEN** the initiative row shows a derived total, a read-only DEX modifier, and an editable misc modifier input (for owner) or static text (for non-owner)

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
