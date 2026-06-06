## ADDED Requirements

### Requirement: Shield total includes a manually entered misc modifier
The spaceship editor SHALL display a Misc Mod integer input in the Shields section. The computed Shield Total SHALL equal the sum of the four directional shield totals plus the misc modifier. The misc modifier SHALL be persisted as `shield_misc_mod` on the `spaceships` row.

#### Scenario: Misc mod defaults to zero
- **WHEN** a spaceship exists with no misc mod set
- **THEN** the Misc Mod input shows 0 and the Shield Total equals the sum of the four directional values

#### Scenario: Misc mod is added to shield total
- **WHEN** the user enters a value in the Misc Mod field
- **THEN** the Shield Total immediately reflects forward + port + starboard + aft + misc mod

#### Scenario: Misc mod saves via debounced onChange
- **WHEN** the user changes the Misc Mod field
- **THEN** the value is persisted after a 600ms debounce
