## ADDED Requirements

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
