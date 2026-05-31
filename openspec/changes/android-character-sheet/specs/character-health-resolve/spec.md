## MODIFIED Requirements

### Requirement: Health & Resolve section on character sheet
The character detail page SHALL render a health section whose rows depend on the character's race type. Biological characters SHALL see Stamina Points, Hit Points, and Resolve Points. Android characters SHALL see Hit Points only. Each pool SHALL show a **Total** column and a **Current** column.

#### Scenario: Section always visible
- **WHEN** a character detail page loads
- **THEN** the health section is visible regardless of race, class, or theme selection

#### Scenario: Biological character shows three-row layout
- **WHEN** a biological character detail page loads
- **THEN** the health section shows three rows: Stamina Points, Hit Points, and Resolve Points — each with a Total and a Current value

#### Scenario: Android character shows one-row layout
- **WHEN** an android character detail page loads
- **THEN** the health section shows only one row: Hit Points — with a Total and a Current value

#### Scenario: Android health section title reflects HP-only layout
- **WHEN** an android character detail page loads
- **THEN** the section heading reads "Hit Points" rather than "Health & Resolve"

### Requirement: Owner can edit health values appropriate to their character type
The character owner SHALL be able to edit the health values shown for their character type. Biological owners edit six values (SP/HP/RP total and current). Android owners edit two values (HP total and current only). Changes are persisted via debounced save (600 ms).

#### Scenario: Biological owner sees six editable inputs
- **WHEN** the biological character owner views the health section
- **THEN** all six values (SP total, SP current, HP total, HP current, RP total, RP current) are rendered as number inputs

#### Scenario: Android owner sees two editable inputs
- **WHEN** the android character owner views the health section
- **THEN** only HP total and HP current are rendered as number inputs; no SP or RP inputs are shown

#### Scenario: Non-owner sees read-only display
- **WHEN** a non-owner views the health section of any character
- **THEN** all visible values are displayed as static text with no editable inputs

### Requirement: Health/resolve values default to zero
All health/resolve values SHALL default to `0` for new characters and for existing characters after migration.

#### Scenario: New character defaults
- **WHEN** a new character is created
- **THEN** SP total, SP current, HP total, HP current, RP total, and RP current are all `0`
