## ADDED Requirements

### Requirement: Critical damage status is tracked for Life Support and Sensors
The spaceship editor SHALL display a Critical Damage section containing two systems: Life Support and Sensors. Each system SHALL have a single-select button group with four states: None, Glitching, Malfunctioning, and Wrecked. Only one state SHALL be active at a time. Selecting the currently active state SHALL return the system to None.

#### Scenario: Default state is undamaged
- **WHEN** the spaceship page loads
- **THEN** both Life Support and Sensors show None as the active state (no damage)

#### Scenario: DM marks Life Support as Glitching
- **WHEN** the DM clicks Glitching on the Life Support control
- **THEN** Glitching becomes active and the status is persisted to the database

#### Scenario: DM escalates damage from Glitching to Malfunctioning
- **WHEN** the DM clicks Malfunctioning on a system already marked Glitching
- **THEN** Malfunctioning becomes active, Glitching is cleared, and the new status is persisted

#### Scenario: DM clears damage by clicking the active state
- **WHEN** the DM clicks the currently active damage state on a system
- **THEN** the system returns to None and null is persisted

### Requirement: Critical damage status is tracked for Engines and Power Core
The spaceship editor Weapons section SHALL include Engines and Power Core damage controls at the top of the section. Each SHALL use the same single-select button group (None / Glitching / Malfunctioning / Wrecked) and persistence behavior as Life Support and Sensors.

#### Scenario: Engines marked as Wrecked
- **WHEN** the DM clicks Wrecked on Engines
- **THEN** Wrecked becomes active and is persisted to the database

#### Scenario: Power Core starts undamaged
- **WHEN** the spaceship loads with no saved damage
- **THEN** Power Core shows None as the active state

### Requirement: Critical damage status is persisted per spaceship
Each of the eight damage systems (Life Support, Sensors, Engines, Power Core, Forward arc, Port arc, Starboard arc, Aft arc) SHALL be stored as a nullable text column on the `spaceships` table. Valid values are `null` (undamaged), `"glitching"`, `"malfunctioning"`, `"wrecked"`.

#### Scenario: Status survives page reload
- **WHEN** the DM marks Sensors as Malfunctioning and reloads the page
- **THEN** Sensors still shows Malfunctioning

#### Scenario: Null is stored for undamaged systems
- **WHEN** a system has no damage applied
- **THEN** its column value is null in the database
