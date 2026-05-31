## Requirements

### Requirement: Attack bonus totals are displayed on the character sheet
The system SHALL display three derived attack bonus totals — Melee, Ranged, and Thrown — in the Combat Stats section, each calculated as BAB + ability modifier + misc modifier.

#### Scenario: Melee attack bonus calculated correctly
- **WHEN** a character has BAB = 3, STR score = 14 (modifier +2), and melee misc mod = 1
- **THEN** the Melee Attack total SHALL display as +6

#### Scenario: Ranged attack bonus calculated correctly
- **WHEN** a character has BAB = 3, DEX score = 16 (modifier +3), and ranged misc mod = 0
- **THEN** the Ranged Attack total SHALL display as +6

#### Scenario: Thrown attack bonus calculated correctly
- **WHEN** a character has BAB = 3, STR score = 14 (modifier +2), and thrown misc mod = 0
- **THEN** the Thrown Attack total SHALL display as +5

### Requirement: Attack bonus misc modifiers are editable by the character owner
The system SHALL allow the character owner to enter a per-type misc modifier for each of the three attack types. Edits SHALL be persisted via debounced save (600 ms).

#### Scenario: Owner can edit misc modifier
- **WHEN** the character owner changes the melee misc mod input
- **THEN** the melee total SHALL update immediately in the UI and the value SHALL be saved to the database after 600 ms of inactivity

#### Scenario: Non-owner sees read-only values
- **WHEN** a user who is not the character owner views the character sheet
- **THEN** the misc modifier fields SHALL be displayed as static text, not inputs

### Requirement: Attack bonus totals react to ability score changes
The system SHALL update attack bonus totals in real time when the user edits STR or DEX in the ability scores section, without a page reload.

#### Scenario: STR change updates melee and thrown totals
- **WHEN** the character owner changes the STR score
- **THEN** both Melee and Thrown attack totals SHALL recalculate immediately

#### Scenario: DEX change updates ranged total
- **WHEN** the character owner changes the DEX score
- **THEN** the Ranged attack total SHALL recalculate immediately
