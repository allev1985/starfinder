## ADDED Requirements

### Requirement: Languages field on characters table
The database `characters` table SHALL have a `languages` text array column with a default of an empty array and NOT NULL constraint.

#### Scenario: Column exists after migration
- **WHEN** the migration runs
- **THEN** the `characters` table has a `languages text[]` column defaulting to `'{}'`

### Requirement: Owner can add a language
The character sheet SHALL display a languages section in the gear tab. The owner SHALL be able to type a language name into an input and add it to the list. The language SHALL be saved immediately (no debounce) via a server action that appends to the array.

#### Scenario: Owner adds a language
- **WHEN** the owner types "Common" and submits the add form
- **THEN** "Common" is appended to `characters.languages` and appears as a badge in the list

#### Scenario: Empty input is rejected
- **WHEN** the owner submits the add form with an empty or whitespace-only input
- **THEN** no language is added and no server action is called

### Requirement: Owner can remove a language
The character sheet SHALL allow the owner to remove a language by clicking a remove button on its badge. The language SHALL be deleted from the array immediately via a server action.

#### Scenario: Owner removes a language
- **WHEN** the owner clicks the remove button on a language badge
- **THEN** that language is removed from `characters.languages` and disappears from the list

### Requirement: Non-owner sees read-only language list
When viewed by a non-owner, the languages SHALL be displayed as badges with no add input or remove buttons.

#### Scenario: Non-owner views languages
- **WHEN** a non-owner views the character sheet
- **THEN** language badges are shown without remove controls and no add input is visible

### Requirement: Empty languages list shows a placeholder
When no languages are recorded and the viewer is the owner, the section SHALL show a placeholder message prompting the owner to add a language.

#### Scenario: No languages yet
- **WHEN** the character has no languages recorded and the owner views the sheet
- **THEN** a placeholder such as "No languages added" is shown alongside the add input
