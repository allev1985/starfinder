### Requirement: Ability score columns on characters table
The `characters` table SHALL have 6 integer columns — `str_score`, `dex_score`, `con_score`, `int_score`, `wis_score`, `cha_score` — each NOT NULL with a default of `10`.

#### Scenario: New character has default scores
- **WHEN** a new character is created without specifying ability scores
- **THEN** all 6 ability score columns are set to `10`

#### Scenario: Existing characters after migration
- **WHEN** the migration runs against existing character rows
- **THEN** all 6 ability score columns on those rows are set to `10`

### Requirement: Ability scores section on character sheet
The character detail page SHALL render an Ability Scores section displaying all 6 abilities (STR, DEX, CON, INT, WIS, CHA) with their score and derived modifier. The section SHALL always be visible regardless of race, class, or theme selection.

#### Scenario: Section visible with no race selected
- **WHEN** a character has no race assigned
- **THEN** the Ability Scores section still appears on the character sheet

#### Scenario: Modifier derived from score
- **WHEN** a score value is displayed
- **THEN** the modifier shown equals `floor((score - 10) / 2)`, formatted with a leading `+` for non-negative values (e.g., `+0`, `+2`, `-1`)

### Requirement: Owner sees editable ability score inputs
The character owner SHALL be able to edit each ability score via an input field. The score is the player's final total value; no calculation is applied.

#### Scenario: Owner sees input fields
- **WHEN** the character owner views the character detail page
- **THEN** each of the 6 abilities renders as a numeric input pre-filled with the current score

#### Scenario: Score auto-saves on blur
- **WHEN** the owner edits an ability score input and moves focus away
- **THEN** the new score is persisted without any additional user action

### Requirement: Non-owner sees read-only ability scores
A non-owner viewing the character sheet SHALL see ability scores and modifiers as static text, with no editable inputs.

#### Scenario: Non-owner sees read-only values
- **WHEN** a non-owner views the character detail page
- **THEN** each ability score and its modifier are rendered as read-only text
