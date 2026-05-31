## ADDED Requirements

### Requirement: armor table is part of the CRB reference dataset
The `armor` table SHALL be treated as CRB reference data alongside `races`, `classes`, `themes`, and `skills`. All CRB armor rows SHALL have `source_book = 'crb'`. The table SHALL be populated via a dedicated seed migration, not application code.

#### Scenario: armor rows are present after seed migration
- **WHEN** the CRB armor seed migration runs
- **THEN** `SELECT COUNT(*) FROM armor WHERE source_book = 'crb'` returns a non-zero count

### Requirement: class_armor_proficiency table is part of the CRB reference dataset
The `class_armor_proficiency` table SHALL be treated as CRB reference data. Its rows SHALL be populated via a dedicated seed migration that runs after both the `classes` table seed and the `armor_type` enum exist.

#### Scenario: class_armor_proficiency rows are present after seed migration
- **WHEN** the class proficiency seed migration runs
- **THEN** `SELECT COUNT(*) FROM class_armor_proficiency` returns 9 (5 light-only classes × 1 + 2 heavy-proficient classes × 2 = 9 rows)
