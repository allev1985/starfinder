## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: EAC and KAC armor bonus and misc modifier are owner-editable
**Reason**: Armor bonus is now derived from the equipped armor row, not manually entered. The `eac_armor_bonus` and `kac_armor_bonus` columns are removed from `character_combat_stats`. Only `eac_misc_mod` and `kac_misc_mod` remain editable.
**Migration**: Characters with existing manually-entered armor bonus values will lose those values. The values had no semantic meaning without an armor row and are intentionally discarded. Owners should equip armor from the new picker to restore their AC.
