## MODIFIED Requirements

### Requirement: race_type enum
The system SHALL define a Postgres enum `race_type` with values `'biological'` and `'drone'`. This enum SHALL be used as the column type wherever a race category is stored.

#### Scenario: Invalid race type is rejected at DB level
- **WHEN** a row is inserted with a `race_type` value not in the enum
- **THEN** the database rejects the insert with a type error

### Requirement: race_descriptions reference table
The system SHALL have a `race_descriptions` table with columns `id` (uuid PK), `race_type` (race_type enum NOT NULL), `name` (text NOT NULL), and `sort_order` (integer NOT NULL). The table SHALL be seeded via migration with all description fields for each race type.

Biological fields (in order): Size, Walking Speed, Running Speed, Gender, Home World, Alignment, Deity.
Drone fields (in order): Chassis Type, Size, Land Speed, Fly Speed, Climb Speed.

#### Scenario: Biological description fields are present after migration
- **WHEN** the migrations run on a fresh database
- **THEN** `race_descriptions` contains exactly 7 rows with `race_type = 'biological'`

#### Scenario: Drone description fields are present after migration
- **WHEN** the migrations run on a fresh database
- **THEN** `race_descriptions` contains exactly 5 rows with `race_type = 'drone'`

### Requirement: getDescriptionsForType query
The system SHALL provide a query function `getDescriptionsForType(raceType: 'biological' | 'drone')` that returns all `race_descriptions` rows for that type ordered by `sort_order` ascending.

#### Scenario: Returns correct fields for biological races
- **WHEN** `getDescriptionsForType('biological')` is called
- **THEN** 7 description rows are returned in sort order

#### Scenario: Returns correct fields for drone
- **WHEN** `getDescriptionsForType('drone')` is called
- **THEN** 5 description rows are returned in sort order
