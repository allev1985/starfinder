## ADDED Requirements

### Requirement: Classes table records skill ranks per level
The `classes` table SHALL have a `skill_ranks_per_level` integer column. Each of the 7 CRB classes SHALL have the correct base value seeded: Envoy 8, Mechanic 4, Mystic 6, Operative 8, Solarian 4, Soldier 4, Technomancer 4.

#### Scenario: All 7 classes have a non-null skill_ranks_per_level value
- **WHEN** the `classes` table is queried
- **THEN** every row SHALL have a `skill_ranks_per_level` value that is a positive integer

#### Scenario: CRB values are correct
- **WHEN** the `classes` table is queried for Operative
- **THEN** `skill_ranks_per_level` SHALL equal 8

#### Scenario: CRB values are correct for Soldier
- **WHEN** the `classes` table is queried for Soldier
- **THEN** `skill_ranks_per_level` SHALL equal 4
