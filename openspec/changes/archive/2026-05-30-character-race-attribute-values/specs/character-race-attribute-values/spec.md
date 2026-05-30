## ADDED Requirements

### Requirement: character_race_attribute_values table
The system SHALL have a `character_race_attribute_values` table with a composite primary key of `(character_id uuid FK → characters.id ON DELETE CASCADE, attribute_id uuid FK → race_attributes.id ON DELETE CASCADE)` and a `value text NOT NULL DEFAULT ''` column.

#### Scenario: Values persist across page loads
- **WHEN** a user saves a value for a race attribute and reloads the character page
- **THEN** the saved value is displayed in the corresponding field

#### Scenario: Cascade delete on character removal
- **WHEN** a character is deleted
- **THEN** all associated `character_race_attribute_values` rows are also deleted

### Requirement: Upsert character race attribute value
The system SHALL provide a server action that upserts a single `character_race_attribute_values` row for a given `(characterId, attributeId, value)`. The action SHALL only succeed if the calling user is the owner of the character.

#### Scenario: Owner saves a value
- **WHEN** the character owner submits a value for a race attribute
- **THEN** the value is stored and subsequent reads return the new value

#### Scenario: Non-owner cannot save
- **WHEN** a non-owner attempts to call the upsert action for a character
- **THEN** the action returns an error and no value is written

### Requirement: Fetch character race attribute values
The system SHALL provide a query function `getCharacterRaceAttributeValues(characterId)` that returns all saved `(attribute_id, value)` pairs for the given character.

#### Scenario: Returns saved values
- **WHEN** `getCharacterRaceAttributeValues` is called with a character that has saved values
- **THEN** all saved attribute_id/value pairs for that character are returned

#### Scenario: Returns empty array for new character
- **WHEN** `getCharacterRaceAttributeValues` is called for a character with no saved values
- **THEN** an empty array is returned
