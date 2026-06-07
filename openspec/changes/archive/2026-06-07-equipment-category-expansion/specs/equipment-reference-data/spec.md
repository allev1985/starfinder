## MODIFIED Requirements

### Requirement: equipment_category enum
The database SHALL have an `equipment_category` Postgres enum with values: `augmentation_cybernetic`, `augmentation_biotech`, `personal_upgrade`, `ammunition`, `shield`, `computer`, `magic_item`, `trap`, `technological`, `personal`.

#### Scenario: Invalid category is rejected
- **WHEN** an INSERT into `equipment` uses a value not in the enum
- **THEN** the database rejects the insert with a constraint violation

#### Scenario: All ten category values are accepted
- **WHEN** an INSERT uses any of the ten defined category values
- **THEN** the insert succeeds without constraint violation
