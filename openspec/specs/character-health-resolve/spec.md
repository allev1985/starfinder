## ADDED Requirements

### Requirement: Health & Resolve section on character sheet
The character detail page SHALL render a **Health & Resolve** section within the Stats tab, in the right column, positioned below Initiative and above Armor Class. Each pool SHALL show a **Total** column and a **Current** column.

#### Scenario: Section visible in Stats tab right column
- **WHEN** the Stats tab is active
- **THEN** the Health & Resolve section is visible in the right column between Initiative and Armor Class

#### Scenario: Three-row layout
- **WHEN** the Health & Resolve section renders
- **THEN** it shows three rows: Stamina Points, Hit Points, and Resolve Points — each with a Total value and a Current value

#### Scenario: Android shows only Hit Points
- **WHEN** the character race type is "drone"
- **THEN** only the Hit Points row is rendered; Stamina Points and Resolve Points rows are hidden

### Requirement: Owner can edit all six health/resolve values
The character owner SHALL be able to edit SP total, SP current, HP total, HP current, RP total, and RP current directly on the character sheet. Changes are persisted on blur.

#### Scenario: Owner sees input fields
- **WHEN** the owner views the Health & Resolve section
- **THEN** all six values are rendered as number inputs

#### Scenario: Values persist on blur
- **WHEN** the owner edits any health/resolve field and moves focus away
- **THEN** all six current values are saved to the database without additional user action

#### Scenario: Non-owner sees read-only display
- **WHEN** a non-owner views the Health & Resolve section
- **THEN** all six values are displayed as static text with no editable inputs

### Requirement: Health/resolve values default to zero
All six health/resolve values SHALL default to `0` for new characters and for existing characters after migration.

#### Scenario: New character defaults
- **WHEN** a new character is created
- **THEN** SP total, SP current, HP total, HP current, RP total, and RP current are all `0`
