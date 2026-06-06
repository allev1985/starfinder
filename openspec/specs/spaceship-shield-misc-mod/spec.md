## Requirements

### Requirement: Shield Misc Mod is a manual integer modifier applied to the Shield Total
The spaceship editor SHALL provide a manual integer input labelled "Misc Mod" in the Shields section. This value SHALL be stored in the database and SHALL be included in the Shield Total calculation (Forward + Port + Starboard + Aft + Misc Mod). The field SHALL accept negative integers to allow downward adjustments.

#### Scenario: Misc Mod defaults to zero
- **WHEN** a spaceship is created
- **THEN** the `shieldMiscMod` column defaults to 0 and the Misc Mod input displays 0

#### Scenario: Shield Total includes Misc Mod
- **WHEN** a spaceship has Forward 10, Port 10, Starboard 10, Aft 10, and Misc Mod 5
- **THEN** the Shield Total displays 45

#### Scenario: Misc Mod accepts negative values
- **WHEN** the user enters a negative integer in the Misc Mod field
- **THEN** the value is accepted, persisted, and reduces the Shield Total accordingly

#### Scenario: Misc Mod saves via debounced onChange
- **WHEN** the user changes the Misc Mod field
- **THEN** the value is persisted after a 600ms debounce
