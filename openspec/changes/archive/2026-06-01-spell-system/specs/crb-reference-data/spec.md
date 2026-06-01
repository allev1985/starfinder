## ADDED Requirements

### Requirement: is_spellcaster flag on classes
The `classes` table SHALL have an `is_spellcaster` column of type `boolean`, not null, defaulting to `false`. A migration SHALL set `is_spellcaster = true` for Mystic and Technomancer; all other CRB classes SHALL remain `false`.

#### Scenario: Mystic is marked as spellcaster
- **WHEN** the migration runs
- **THEN** the Mystic row in `classes` has `is_spellcaster = true`

#### Scenario: Technomancer is marked as spellcaster
- **WHEN** the migration runs
- **THEN** the Technomancer row in `classes` has `is_spellcaster = true`

#### Scenario: Non-spellcasting classes are false
- **WHEN** the migration runs
- **THEN** Envoy, Mechanic, Operative, Solarian, and Soldier all have `is_spellcaster = false`
