## Requirements

### Requirement: Identity fields display in a compact paired sub-grid
Within the identity column of the spaceship editor top row, identity fields SHALL be arranged in a compact two-column sub-grid. Name and Tier SHALL appear together on the first row (Name spanning more width, Tier as a short field). Make & Model SHALL span full width. Size and Frame SHALL share one row. Speed and Maneuverability SHALL share one row. Drift Engine and Drift Rating inputs SHALL appear together. Power Core name and PCU SHALL be moved to the systems row, not the identity column.

#### Scenario: Size and Frame render side by side
- **WHEN** the identity column is rendered
- **THEN** the Size input and the Frame input appear on the same row using a `grid grid-cols-2` layout

#### Scenario: Speed and Maneuverability render side by side
- **WHEN** the identity column is rendered
- **THEN** the Speed input and the Maneuverability input appear on the same row using a `grid grid-cols-2` layout

#### Scenario: Name and Tier render inline
- **WHEN** the identity column is rendered
- **THEN** the Name input and the Tier input appear on the same row

### Requirement: Spaceship stores Tier as free-text
The spaceship record SHALL include a nullable `tier` text column. Valid values include fractional tiers ("1/4", "1/3", "1/2") and integer tiers ("1" through "20"). No validation is enforced — the field is free text.

#### Scenario: User enters a fractional tier
- **WHEN** the user types "1/2" into the Tier field
- **THEN** the value "1/2" is persisted to the `tier` column via the debounced save

#### Scenario: User enters an integer tier
- **WHEN** the user types "8" into the Tier field
- **THEN** the value "8" is persisted to the `tier` column

### Requirement: Spaceship stores Maneuverability as free-text
The spaceship record SHALL include a nullable `maneuverability` text column. The field accepts any text value; canonical 1e values are clumsy, poor, average, good, and perfect.

#### Scenario: User enters maneuverability
- **WHEN** the user types "average" into the Maneuverability field
- **THEN** the value is persisted to the `maneuverability` column via the debounced save

### Requirement: Power Core and Drift Engine inputs are placed in the systems row
The Power Core name, PCU, Drift Engine name, and Drift Rating inputs SHALL be rendered in the left column of the systems row (not in the identity column of the top row).

#### Scenario: Power Core fields are in the systems row
- **WHEN** the spaceship editor is rendered
- **THEN** the Power Core name and PCU inputs appear in the left column of the systems row alongside the Systems and Cargo/Passengers note sections

### Requirement: Spaceship stores Power Core name and PCU
The spaceship record SHALL include a nullable `power_core_name` text column and a nullable `power_core_pcu` integer column. Both are entered manually; no lookup table is provided.

#### Scenario: User enters a power core name
- **WHEN** the user types a power core name (e.g., "Pulse Red") into the Power Core field
- **THEN** the value is persisted to `power_core_name`

#### Scenario: User enters PCU value
- **WHEN** the user enters a numeric value in the PCU field
- **THEN** the integer value is persisted to `power_core_pcu`

### Requirement: Spaceship stores Drift Engine name
The spaceship record SHALL include a nullable `drift_engine` text column for the engine's name. This field pairs with the existing `drift_rating` integer column.

#### Scenario: User enters a drift engine name
- **WHEN** the user types a drift engine name (e.g., "Signal Basic") into the Drift Engine field
- **THEN** the value is persisted to `drift_engine`
