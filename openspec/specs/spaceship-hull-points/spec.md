## Requirements

### Requirement: Spaceship hull points are tracked with four manual fields
The spaceship editor SHALL display a Hull Points section with four manual integer inputs: Total, Current, Damage Threshold, and Critical Threshold. All four fields SHALL be independently editable with no derived relationships enforced by the system.

#### Scenario: User views hull points section with default values
- **WHEN** a spaceship exists with hull fields at zero
- **THEN** the Hull Points section displays Total, Current, Damage Threshold, and Critical Threshold all showing 0

#### Scenario: User enters a hull total value
- **WHEN** the user types a value into the Total field
- **THEN** the value is persisted after a 600ms debounce

#### Scenario: User tracks damage by updating Current
- **WHEN** the user changes the Current field
- **THEN** the updated current HP value is persisted after a 600ms debounce

#### Scenario: User sets Damage Threshold and Critical Threshold
- **WHEN** the user enters values in the DT and CT fields
- **THEN** each value is persisted independently after a 600ms debounce
