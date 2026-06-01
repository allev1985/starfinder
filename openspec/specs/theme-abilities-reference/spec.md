## Requirements

### Requirement: theme_abilities table exists and is seeded
The system SHALL provide a `theme_abilities` table with columns: `id` (uuid PK), `theme_id` (uuid FK → `themes.id`), `name` (text, not null), `description` (text, not null), `level` (integer, not null — one of 1, 6, 12, 18), `source_book` (text, not null, default `'crb'`). The table SHALL be seeded with all theme features for all 10 CRB themes.

#### Scenario: All 10 CRB themes have seeded theme abilities
- **WHEN** the seed migration runs
- **THEN** each of the 10 CRB themes has at least one row in `theme_abilities`

#### Scenario: All themes have a level 1 ability
- **WHEN** the seed migration runs
- **THEN** every CRB theme has exactly one `theme_abilities` row with `level = 1`

#### Scenario: Abilities are only at valid unlock levels
- **WHEN** the seed migration runs
- **THEN** every row in `theme_abilities` has `level` in {1, 6, 12, 18}

#### Scenario: Themeless theme has its level 1 ability
- **WHEN** the seed migration runs
- **THEN** the Themeless theme has a `level = 1` row with name "Theme Knowledge"

### Requirement: Reference query for theme abilities by theme
The system SHALL expose a server-side query `getThemeAbilities(themeId: string): Promise<ThemeAbility[]>` that returns all abilities for the given theme ordered by `level` ascending.

#### Scenario: Query returns ordered results for a valid theme
- **WHEN** `getThemeAbilities` is called with a valid theme ID
- **THEN** results are returned ordered by `level` ascending

#### Scenario: Query returns empty array for unknown theme
- **WHEN** `getThemeAbilities` is called with an ID that does not exist in `themes`
- **THEN** an empty array is returned
