## Requirements

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
