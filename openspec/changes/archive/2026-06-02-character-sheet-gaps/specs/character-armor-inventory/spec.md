## ADDED Requirements

### Requirement: DR and Resistances columns on armor reference table
The `armor` reference table SHALL have `dr` (text, nullable) and `resistances` (text, nullable) columns. Existing rows default to null.

#### Scenario: Columns exist after migration
- **WHEN** the migration runs
- **THEN** the `armor` table has `dr` and `resistances` text columns that allow null

#### Scenario: Existing armor rows have null values
- **WHEN** the migration runs on existing armor rows
- **THEN** all pre-existing rows have `dr = null` and `resistances = null`
