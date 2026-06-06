## ADDED Requirements

### Requirement: Shield directional values are entered in a compass layout with a computed total
The spaceship editor SHALL display a Shields section with four manual integer inputs — Forward, Port, Starboard, Aft — arranged in a compass layout (Forward top, Port left, Starboard right, Aft bottom). The section SHALL also display a computed Shield Total (read-only, equal to the sum of all four directional values) and a manual Regen/min integer input.

#### Scenario: User views shields section with default values
- **WHEN** a spaceship exists with all shield fields at zero
- **THEN** all four directional inputs show 0, Shield Total shows 0, and Regen/min shows 0

#### Scenario: Compass layout positions inputs spatially
- **WHEN** the user views the Shields section
- **THEN** the Forward input is centered at the top, Port is on the left, Starboard is on the right, and Aft is centered at the bottom

#### Scenario: Shield Total updates when a directional value changes
- **WHEN** the user changes any directional shield input
- **THEN** the Shield Total immediately reflects the new sum of all four directional values

#### Scenario: Directional shield inputs save via debounced onChange
- **WHEN** the user changes any directional shield field
- **THEN** the value is persisted after a 600ms debounce

#### Scenario: Regen/min saves via debounced onChange
- **WHEN** the user changes the Regen/min field
- **THEN** the value is persisted after a 600ms debounce
