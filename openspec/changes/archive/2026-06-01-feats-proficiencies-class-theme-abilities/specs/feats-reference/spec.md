## ADDED Requirements

### Requirement: feats table exists and is seeded
The system SHALL provide a `feats` table with columns: `id` (uuid PK), `name` (text, not null, unique), `description` (text, not null), `prerequisites` (text, nullable — full CRB prerequisite text), `is_combat_feat` (boolean, not null, default false), `source_book` (text, not null, default `'crb'`). The table SHALL be seeded with all general and combat feats from the Starfinder CRB.

#### Scenario: CRB feats are present after seed migration
- **WHEN** the seed migration runs
- **THEN** `SELECT COUNT(*) FROM feats WHERE source_book = 'crb'` returns at least 90

#### Scenario: Combat feats are flagged correctly
- **WHEN** the seed migration runs
- **THEN** feats designated as Combat Feats in the CRB (e.g., Cleave, Weapon Focus) have `is_combat_feat = true`

#### Scenario: Feat names are unique
- **WHEN** the seed migration runs
- **THEN** no two rows in `feats` share the same `name`

### Requirement: Feat search query
The system SHALL expose a server-side query `searchFeats(query: string): Promise<Feat[]>` that performs a case-insensitive prefix/substring match on `feats.name`, returning up to 20 results ordered alphabetically.

#### Scenario: Partial name match returns results
- **WHEN** `searchFeats("skill")` is called
- **THEN** at least "Skill Focus" and "Skill Synergy" are returned

#### Scenario: Empty query returns first 20 feats alphabetically
- **WHEN** `searchFeats("")` is called
- **THEN** up to 20 feats are returned ordered by name ascending

#### Scenario: No match returns empty array
- **WHEN** `searchFeats("xyznotafeat")` is called
- **THEN** an empty array is returned
