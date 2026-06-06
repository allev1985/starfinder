## ADDED Requirements

### Requirement: Weapons arc damage status is tracked for Forward, Port, Starboard, and Aft arcs
The spaceship editor Weapons section SHALL display a single-select damage status button group (None / Glitching / Malfunctioning / Wrecked) below the weapon list for each of the four arcs: Forward, Port, Starboard, and Aft. The Turret arc SHALL NOT have a damage status control. Arc damage is arc-level, not per individual weapon entry.

#### Scenario: Forward arc damage is marked Glitching
- **WHEN** the DM clicks Glitching under the Forward arc
- **THEN** Glitching becomes active for the Forward arc and is persisted to the database

#### Scenario: Turret arc has no damage control
- **WHEN** the Turret arc section is rendered
- **THEN** no damage status button group is displayed for Turret

#### Scenario: Aft arc damage defaults to None
- **WHEN** the spaceship loads with no saved arc damage
- **THEN** the Aft arc damage control shows None as the active state

#### Scenario: Clearing arc damage
- **WHEN** the DM clicks the currently active damage state on an arc
- **THEN** the arc damage returns to None and null is persisted
