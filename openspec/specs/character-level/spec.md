## ADDED Requirements

### Requirement: Level column on characters
The `characters` table SHALL have a `level` integer column that is NOT NULL with a DEFAULT of 1. All existing character rows SHALL receive level 1 via the migration default. Level SHALL be constrained to the range 1–20 at the application layer.

#### Scenario: New character defaults to level 1
- **WHEN** a character is created without an explicit level value
- **THEN** the character row has `level = 1`

#### Scenario: Existing characters receive level 1 after migration
- **WHEN** the migration runs on a database with existing character rows
- **THEN** all existing characters have `level = 1`

### Requirement: Level displayed on character detail page
The character detail page SHALL display the character's current level for all authorized viewers alongside race, class, and theme.

#### Scenario: Authorized viewer sees level
- **WHEN** an authorized user views the character detail page
- **THEN** the character's level is displayed

### Requirement: Inline level control for owner
The character detail page SHALL provide the character owner with inline − and + buttons to decrement and increment the character's level. The control SHALL be optimistic: the displayed value updates immediately on click and reverts on server error.

#### Scenario: Owner increments level
- **WHEN** the owner clicks the + button and the current level is below 20
- **THEN** the level is incremented by 1, saved to the database, and the displayed value reflects the new level

#### Scenario: Owner decrements level
- **WHEN** the owner clicks the − button and the current level is above 1
- **THEN** the level is decremented by 1, saved to the database, and the displayed value reflects the new level

#### Scenario: + button disabled at level 20
- **WHEN** the character's level is 20
- **THEN** the + button is disabled and cannot be clicked

#### Scenario: − button disabled at level 1
- **WHEN** the character's level is 1
- **THEN** the − button is disabled and cannot be clicked

#### Scenario: Non-owner does not see level controls
- **WHEN** a non-owner views the character detail page
- **THEN** the level is displayed as read-only text with no − or + buttons

#### Scenario: Server action rejects out-of-range level
- **WHEN** the server action receives a level value outside 1–20
- **THEN** the action returns an error and no update is written
