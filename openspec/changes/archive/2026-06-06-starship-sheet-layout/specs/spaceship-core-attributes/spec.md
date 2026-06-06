## MODIFIED Requirements

### Requirement: Spaceship stores Tier as free-text
The spaceship record SHALL include a nullable `tier` text column. Valid values include fractional tiers ("1/4", "1/3", "1/2") and integer tiers ("1" through "20"). No validation is enforced — the field is free text. The Tier field SHALL render inline with the Name field in a compact header row inside the identity block.

#### Scenario: User enters a fractional tier
- **WHEN** the user types "1/2" into the Tier field
- **THEN** the value "1/2" is persisted to the `tier` column via the debounced save

#### Scenario: User enters an integer tier
- **WHEN** the user types "8" into the Tier field
- **THEN** the value "8" is persisted to the `tier` column

### Requirement: Spaceship identity fields render in a compact paired grid
The identity block SHALL display Name and Tier on the first row (Name taking remaining width, Tier fixed narrow), Make and Model as a full-width row, then Size|Frame and Speed|Maneuverability as 2-column paired rows, then Drift Engine and Drift Rating together. This matches the PDF Play Sheet identity column layout.

#### Scenario: Size and Frame appear side by side
- **WHEN** the identity block renders at any viewport width
- **THEN** the Size field and Frame field appear in a 2-column sub-grid on the same row

#### Scenario: Speed and Maneuverability appear side by side
- **WHEN** the identity block renders at any viewport width
- **THEN** the Speed field and Maneuverability field appear in a 2-column sub-grid on the same row

### Requirement: Spaceship stores Maneuverability as free-text
The spaceship record SHALL include a nullable `maneuverability` text column. The field accepts any text value; canonical 1e values are clumsy, poor, average, good, and perfect.

#### Scenario: User enters maneuverability
- **WHEN** the user types "average" into the Maneuverability field
- **THEN** the value is persisted to the `maneuverability` column via the debounced save

### Requirement: Spaceship stores Power Core name and PCU
The spaceship record SHALL include a nullable `power_core_name` text column and a nullable `power_core_pcu` integer column. Both are entered manually; no lookup table is provided. Power Core fields SHALL render in the left column of the systems row.

#### Scenario: User enters a power core name
- **WHEN** the user types a power core name (e.g., "Pulse Red") into the Power Core field
- **THEN** the value is persisted to `power_core_name`

#### Scenario: User enters PCU value
- **WHEN** the user enters a numeric value in the PCU field
- **THEN** the integer value is persisted to `power_core_pcu`

### Requirement: Spaceship stores Drift Engine name
The spaceship record SHALL include a nullable `drift_engine` text column for the engine's name. This field pairs with the existing `drift_rating` integer column. Drift Engine and Drift Rating SHALL render in the left column of the systems row, below Power Core.

#### Scenario: User enters a drift engine name
- **WHEN** the user types a drift engine name (e.g., "Signal Basic") into the Drift Engine field
- **THEN** the value is persisted to `drift_engine`
