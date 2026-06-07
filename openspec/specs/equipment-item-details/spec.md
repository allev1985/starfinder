## Requirements

### Requirement: Equipment item detail fields
The `equipment` reference table SHALL store the following optional detail columns in addition to existing fields:
- `description` — text, nullable — a long-form description of the item
- `capacity` — integer, nullable — the item's charge/battery capacity
- `usage` — integer, nullable — the number of charges consumed per use
- `hands` — integer, nullable — the number of hands required to use the item

#### Scenario: Schema includes detail columns
- **WHEN** the schema migration runs
- **THEN** the `equipment` table has `description` (text, nullable), `capacity` (integer, nullable), `usage` (integer, nullable), and `hands` (integer, nullable) columns

#### Scenario: Detail columns accept null
- **WHEN** an equipment row is inserted without specifying description, capacity, usage, or hands
- **THEN** those columns read back as null

#### Scenario: Detail columns accept values
- **WHEN** an equipment row is inserted with description, capacity, usage, and hands values
- **THEN** those columns read back with the stored values

### Requirement: Equipment detail data is included in reference queries
Any query that fetches equipment reference data for display (e.g. for the character sheet picker or equipment cards) SHALL include the `description`, `capacity`, `usage`, and `hands` columns.

#### Scenario: Equipment picker query returns detail columns
- **WHEN** the equipment reference data is fetched for a character sheet
- **THEN** each equipment item includes description, capacity, usage, and hands alongside existing fields

#### Scenario: Admin equipment list query returns detail columns
- **WHEN** the admin equipment table data is fetched
- **THEN** each equipment record includes description, capacity, usage, and hands
