## Requirements

### Requirement: Spaceship AC and TL scores are computed from manual component inputs
The spaceship editor SHALL display an AC/TL section with manual-entry integer inputs for `pilotRank`, `sizeMod`, `armorBonus`, `acMiscMod`, `countermeasures`, and `tlMiscMod`. The system SHALL compute and display:
- `AC = 10 + pilotRank + armorBonus + sizeMod + acMiscMod`
- `TL = 10 + pilotRank + countermeasures + sizeMod + tlMiscMod`

`pilotRank` and `sizeMod` are shared between AC and TL and SHALL be rendered as single inputs.

#### Scenario: User views spaceship with default values
- **WHEN** a spaceship exists with all AC/TL fields at zero
- **THEN** AC displays as 10 and TL displays as 10

#### Scenario: User enters component values
- **WHEN** the user enters values across the AC/TL inputs
- **THEN** the computed AC and TL totals update to reflect `10 + pilotRank + armorBonus + sizeMod + acMiscMod` and `10 + pilotRank + countermeasures + sizeMod + tlMiscMod` respectively

#### Scenario: Component inputs save via debounced onChange
- **WHEN** the user changes any AC/TL input field
- **THEN** the value is persisted after a 600ms debounce with no explicit save action required
