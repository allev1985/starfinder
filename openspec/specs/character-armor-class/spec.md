## ADDED Requirements

### Requirement: EAC total is derived and displayed
The character sheet SHALL display an EAC total equal to `10 + armor.eac_bonus + effectiveDex + eac_misc_mod`, where `effectiveDex` is `min(modifier(dex_score), armor.max_dex_bonus)` when `max_dex_bonus` is not null, or `modifier(dex_score)` when `max_dex_bonus` is null (no cap). When no armor is equipped, `armor.eac_bonus` is treated as 0 and the DEX modifier is uncapped. The total SHALL NOT be stored in the database.

#### Scenario: EAC total reflects all components with DEX cap
- **WHEN** a character has `dex_score = 18` (modifier +4), equipped armor with `eac_bonus = 3` and `max_dex_bonus = 2`, and `eac_misc_mod = 1`
- **THEN** the EAC total displayed is `10 + 3 + 2 + 1 = 16` (DEX capped at +2)

#### Scenario: EAC total with no DEX cap
- **WHEN** a character has `dex_score = 18` (modifier +4), equipped armor with `eac_bonus = 1` and `max_dex_bonus = null`, and `eac_misc_mod = 0`
- **THEN** the EAC total displayed is `10 + 1 + 4 + 0 = 15` (no cap applied)

#### Scenario: EAC total with no armor equipped
- **WHEN** a character has no armor equipped and `dex_score = 14` (modifier +2) and `eac_misc_mod = 0`
- **THEN** the EAC total displayed is `10 + 0 + 2 + 0 = 12`

#### Scenario: EAC total updates when DEX score changes
- **WHEN** the owner changes the DEX ability score
- **THEN** the EAC total in the Combat Stats section reflects the updated (and capped) DEX modifier

### Requirement: KAC total is derived and displayed
The character sheet SHALL display a KAC total equal to `10 + armor.kac_bonus + effectiveDex + kac_misc_mod`, applying the same DEX cap logic as EAC. The total SHALL NOT be stored in the database.

#### Scenario: KAC total reflects all components with DEX cap
- **WHEN** a character has `dex_score = 18` (modifier +4), equipped armor with `kac_bonus = 5` and `max_dex_bonus = 2`, and `kac_misc_mod = 0`
- **THEN** the KAC total displayed is `10 + 5 + 2 + 0 = 17` (DEX capped at +2)

#### Scenario: KAC total with no armor equipped
- **WHEN** a character has no armor equipped and `dex_score = 14` (modifier +2) and `kac_misc_mod = 0`
- **THEN** the KAC total displayed is `10 + 0 + 2 + 0 = 12`

#### Scenario: KAC total updates when DEX score changes
- **WHEN** the owner changes the DEX ability score
- **THEN** the KAC total in the Combat Stats section reflects the updated (and capped) DEX modifier

### Requirement: Armor bonus column in AC grid is read-only
The AC grid SHALL display the armor bonus as a read-only value derived from the equipped armor row (`armor.eac_bonus` and `armor.kac_bonus`). There SHALL be no editable input for the armor bonus. The column header SHALL read "Armor Bonus".

#### Scenario: Armor bonus displays equipped armor's value
- **WHEN** a character has an armor with `eac_bonus = 3` and `kac_bonus = 5` equipped
- **THEN** the EAC row shows 3 and the KAC row shows 5 in the Armor Bonus column as static text

#### Scenario: Armor bonus shows 0 when no armor equipped
- **WHEN** a character has no armor equipped
- **THEN** both EAC and KAC rows show 0 in the Armor Bonus column

#### Scenario: Non-owner sees same read-only display
- **WHEN** a non-owner views the character sheet
- **THEN** the Armor Bonus column shows the same read-only values as for the owner

### Requirement: KAC vs. Combat Maneuvers is derived and displayed
The character sheet SHALL display a KAC vs. Combat Maneuvers value equal to `8 + KAC total`. The value SHALL NOT be stored in the database and has no editable inputs.

#### Scenario: KAC vs. CM reflects KAC total
- **WHEN** the KAC total is `15`
- **THEN** the KAC vs. Combat Maneuvers value displayed is `23`

#### Scenario: KAC vs. CM row has no editable inputs
- **WHEN** any user views the character sheet
- **THEN** the KAC vs. Combat Maneuvers row shows only a read-only derived value

### Requirement: Armor Class rows displayed in Combat Stats section
The Combat Stats section SHALL render EAC, KAC, and KAC vs. Combat Maneuvers rows below the Base Attack Bonus row. Each row SHALL display the derived total and relevant component values, with misc modifier editable for the owner.

#### Scenario: AC rows always visible
- **WHEN** a character detail page loads
- **THEN** EAC, KAC, and KAC vs. Combat Maneuvers rows are visible in the Combat Stats section

#### Scenario: AC sub-grid column headers
- **WHEN** the AC rows render
- **THEN** column headers for Total, Armor Bonus, DEX Mod, and Misc are shown above the AC rows

### Requirement: DR and Resistances displayed in Armor Class section
The Armor Class section SHALL display two read-only fields: "DR" and "Resistances". Their values SHALL come from the equipped armor's `dr` and `resistances` columns. When no armor is equipped, or the column value is null or empty, the field SHALL display "—".

#### Scenario: DR shown from equipped armor
- **WHEN** a character has armor equipped with `dr = "5/—"`
- **THEN** the DR field in the Armor Class section shows "5/—"

#### Scenario: Resistances shown from equipped armor
- **WHEN** a character has armor equipped with `resistances = "Cold 5, Fire 5"`
- **THEN** the Resistances field shows "Cold 5, Fire 5"

#### Scenario: No armor equipped shows dash
- **WHEN** no armor is equipped
- **THEN** both DR and Resistances display "—"

#### Scenario: Armor with null DR and Resistances shows dash
- **WHEN** the equipped armor has `dr = null` and `resistances = null`
- **THEN** both fields display "—"

#### Scenario: Non-owner sees the same read-only display
- **WHEN** a non-owner views the character sheet
- **THEN** DR and Resistances are displayed identically to the owner view
