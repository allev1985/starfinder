## ADDED Requirements

### Requirement: Chassis reference table seeded via migration
The system SHALL seed the `chassis` table via migration with 3 rows corresponding to the Starfinder 1e CRB chassis types. Each row SHALL set `bonus_skill_id` to the FK of the named skill where applicable, and `null` where the chassis has no bonus skill.

#### Scenario: Three chassis rows present after migration
- **WHEN** the chassis seeding migration runs
- **THEN** the `chassis` table contains exactly 3 rows: "Combat", "Hover", and "Stealth"

#### Scenario: Hover chassis bonus skill resolves to Acrobatics
- **WHEN** the Hover chassis row is joined to the `skills` table via `bonus_skill_id`
- **THEN** the skill name is "Acrobatics"

#### Scenario: Stealth chassis bonus skill resolves to Stealth
- **WHEN** the Stealth chassis row is joined to the `skills` table via `bonus_skill_id`
- **THEN** the skill name is "Stealth"

#### Scenario: Combat chassis bonus skill is null
- **WHEN** the Combat chassis row is read
- **THEN** `bonus_skill_id` is null
