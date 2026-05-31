## MODIFIED Requirements

### Requirement: New characters start with an empty skill list
Biological characters SHALL display no skills on creation. Android characters SHALL display their seeded android skill list on creation (see android-skills spec).

#### Scenario: Biological empty state is shown
- **WHEN** a biological character with no `character_skills` rows is viewed
- **THEN** the Skills section SHALL render an empty state message and an "Add Skills" button (for the owner)

#### Scenario: Android shows seeded skill list on creation
- **WHEN** an android character is viewed immediately after creation
- **THEN** the Skills section renders the android's seeded skills with no empty state message

## ADDED Requirements

### Requirement: Ranks budget indicator hidden for android characters
The ranks budget display SHALL not appear on the skills section for android characters.

#### Scenario: No budget shown for android
- **WHEN** an android character's Skills section renders
- **THEN** no ranks used / ranks available indicator is displayed
