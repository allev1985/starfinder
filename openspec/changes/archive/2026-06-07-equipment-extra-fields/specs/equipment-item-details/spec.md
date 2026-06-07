## ADDED Requirements

### Requirement: Equipment item detail fields
The `equipment` table SHALL have four nullable columns: `description` (text), `capacity` (integer), `usage` (integer), and `hands` (integer). All four SHALL default to null. These columns SHALL be independent of equipment category — any category may have any combination of values.

#### Scenario: Migration adds columns without breaking existing rows
- **WHEN** the migration runs against existing equipment rows
- **THEN** all existing rows have null for description, capacity, usage, and hands with no data loss

#### Scenario: Equipment row with all detail fields set
- **WHEN** an equipment row is inserted with description, capacity, usage, and hands values
- **THEN** all four values are stored and retrieved correctly

#### Scenario: Equipment row with no detail fields
- **WHEN** an equipment row is inserted without any of the four new fields
- **THEN** all four columns read back as null
