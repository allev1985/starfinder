## ADDED Requirements

### Requirement: EAC and KAC armor bonus and misc modifier are owner-editable
The character owner SHALL be able to update `eac_armor_bonus`, `eac_misc_mod`, `kac_armor_bonus`, and `kac_misc_mod` via the character sheet. Each value SHALL be persisted to `character_combat_stats` using the debounced onChange pattern (600 ms).

#### Scenario: Owner edits EAC armor bonus
- **WHEN** the owner changes the EAC armor bonus input
- **THEN** the new value is persisted after the 600 ms debounce without additional user action

#### Scenario: Owner edits KAC misc modifier
- **WHEN** the owner changes the KAC misc modifier input
- **THEN** the new value is persisted after the 600 ms debounce without additional user action

#### Scenario: Non-owner sees read-only AC fields
- **WHEN** a non-owner views the character sheet
- **THEN** all four armor class inputs are displayed as static text with no editable inputs

### Requirement: EAC total is derived and displayed
The character sheet SHALL display an EAC total equal to `10 + eac_armor_bonus + modifier(dexScore) + eac_misc_mod`. The total SHALL NOT be stored in the database.

#### Scenario: EAC total reflects all components
- **WHEN** a character has `dex_score = 14`, `eac_armor_bonus = 2`, and `eac_misc_mod = 1`
- **THEN** the EAC total displayed is `15`

#### Scenario: EAC total updates when DEX score changes
- **WHEN** the owner changes the DEX ability score
- **THEN** the EAC total in the Combat Stats section reflects the updated DEX modifier

### Requirement: KAC total is derived and displayed
The character sheet SHALL display a KAC total equal to `10 + kac_armor_bonus + modifier(dexScore) + kac_misc_mod`. The total SHALL NOT be stored in the database.

#### Scenario: KAC total reflects all components
- **WHEN** a character has `dex_score = 14`, `kac_armor_bonus = 3`, and `kac_misc_mod = 0`
- **THEN** the KAC total displayed is `15`

#### Scenario: KAC total updates when DEX score changes
- **WHEN** the owner changes the DEX ability score
- **THEN** the KAC total in the Combat Stats section reflects the updated DEX modifier

### Requirement: KAC vs. Combat Maneuvers is derived and displayed
The character sheet SHALL display a KAC vs. Combat Maneuvers value equal to `8 + KAC total`. The value SHALL NOT be stored in the database and has no editable inputs.

#### Scenario: KAC vs. CM reflects KAC total
- **WHEN** the KAC total is `15`
- **THEN** the KAC vs. Combat Maneuvers value displayed is `23`

#### Scenario: KAC vs. CM row has no editable inputs
- **WHEN** any user views the character sheet
- **THEN** the KAC vs. Combat Maneuvers row shows only a read-only derived value

### Requirement: Armor Class rows displayed in Combat Stats section
The Combat Stats section SHALL render EAC, KAC, and KAC vs. Combat Maneuvers rows below the Base Attack Bonus row. Each row SHALL display the derived total and relevant component values, with armor bonus and misc modifier editable for the owner.

#### Scenario: AC rows always visible
- **WHEN** a character detail page loads
- **THEN** EAC, KAC, and KAC vs. Combat Maneuvers rows are visible in the Combat Stats section

#### Scenario: AC sub-grid column headers
- **WHEN** the AC rows render
- **THEN** column headers for Total, Armor Bonus, DEX Mod, and Misc are shown above the AC rows
