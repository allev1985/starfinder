## Requirements

### Requirement: Credits field on characters table
The database `characters` table SHALL have a `credits` integer column with a default of 0 and NOT NULL constraint.

#### Scenario: Column exists after migration
- **WHEN** the migration runs
- **THEN** the `characters` table has a `credits` integer column defaulting to 0

### Requirement: Owner can view and edit credits
The character sheet SHALL display a "Credits" numeric input in the gear tab. The owner SHALL be able to edit the value; changes SHALL be saved via a debounced server action (600 ms delay). Non-owners SHALL see the value as read-only text.

#### Scenario: Owner edits credits
- **WHEN** the owner changes the credits input
- **THEN** after 600 ms the new value is persisted to `characters.credits`

#### Scenario: Non-owner sees read-only credits
- **WHEN** a non-owner views the character sheet
- **THEN** the credits value is displayed as static text with no input

#### Scenario: Credits displays 0 for new characters
- **WHEN** a new character is created
- **THEN** the credits field displays 0
