## Requirements

### Requirement: XP Earned field on characters table
The database `characters` table SHALL have an `xp_earned` integer column with a default of 0 and NOT NULL constraint.

#### Scenario: Column exists after migration
- **WHEN** the migration runs
- **THEN** the `characters` table has an `xp_earned` integer column defaulting to 0

### Requirement: Owner can view and edit XP Earned
The character sheet SHALL display an "XP Earned" numeric input. The owner SHALL be able to edit the value; changes SHALL be saved via a debounced server action (600 ms delay). Non-owners SHALL see the value as read-only text.

#### Scenario: Owner edits XP Earned
- **WHEN** the owner changes the XP Earned input
- **THEN** after 600 ms the new value is persisted to `characters.xp_earned`

#### Scenario: Non-owner sees read-only XP
- **WHEN** a non-owner views the character sheet
- **THEN** the XP Earned value is displayed as static text with no input

#### Scenario: XP displays 0 for new characters
- **WHEN** a new character is created
- **THEN** the XP Earned field displays 0
