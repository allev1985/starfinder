## ADDED Requirements

### Requirement: Health & Resolve section on character sheet
The character detail page SHALL render a **Health & Resolve** section displaying Stamina Points, Hit Points, and Resolve Points. Each pool SHALL show a **Total** column and a **Current** column.

#### Scenario: Section always visible
- **WHEN** a character detail page loads
- **THEN** the Health & Resolve section is visible regardless of race, class, or theme selection

#### Scenario: Three-row layout
- **WHEN** the Health & Resolve section renders
- **THEN** it shows three rows: Stamina Points, Hit Points, and Resolve Points — each with a Total value and a Current value

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
