## REMOVED Requirements

### Requirement: character_race_attribute_values table
**Reason**: Replaced by `character_descriptions` table keyed by `description_id → race_descriptions.id`. The old table referenced `race_attributes` which is being dropped.
**Migration**: No data migration required — existing values are confirmed empty. Drop the table.

### Requirement: Upsert character race attribute value
**Reason**: Replaced by `upsertDescriptionValueForOwner` acting on `character_descriptions`.
**Migration**: Rename and update the server action and service function to use `description_id` instead of `attribute_id`.

### Requirement: Fetch character race attribute values
**Reason**: Replaced by `getCharacterDescriptionValues(characterId)`.
**Migration**: Update query and all call sites to use the new function name and table.

## ADDED Requirements

### Requirement: character_descriptions table
The system SHALL have a `character_descriptions` table with a composite primary key of `(character_id uuid FK → characters.id ON DELETE CASCADE, description_id uuid FK → race_descriptions.id ON DELETE CASCADE)` and a `value text NOT NULL DEFAULT ''` column.

#### Scenario: Values persist across page loads
- **WHEN** a user saves a value for a description field and reloads the character page
- **THEN** the saved value is displayed in the corresponding field

#### Scenario: Cascade delete on character removal
- **WHEN** a character is deleted
- **THEN** all associated `character_descriptions` rows are also deleted

### Requirement: Upsert character description value
The system SHALL provide a server action that upserts a single `character_descriptions` row for a given `(characterId, descriptionId, value)`. The action SHALL only succeed if the calling user is the owner of the character.

#### Scenario: Owner saves a value
- **WHEN** the character owner submits a value for a description field
- **THEN** the value is stored and subsequent reads return the new value

#### Scenario: Non-owner cannot save
- **WHEN** a non-owner attempts to call the upsert action for a character
- **THEN** the action returns an error and no value is written

### Requirement: Fetch character description values
The system SHALL provide a query function `getCharacterDescriptionValues(characterId)` that returns all saved `(description_id, value)` pairs for the given character.

#### Scenario: Returns saved values
- **WHEN** `getCharacterDescriptionValues` is called with a character that has saved values
- **THEN** all saved description_id/value pairs for that character are returned

#### Scenario: Returns empty array for new character
- **WHEN** `getCharacterDescriptionValues` is called for a character with no saved values
- **THEN** an empty array is returned

### Requirement: Description values cleared only on race type change
The system SHALL clear a character's `character_descriptions` rows only when the character's race is updated to a race of a different `race_type`. Swapping between two races of the same type SHALL preserve existing description values.

#### Scenario: Same-type race swap preserves values
- **WHEN** a character's race is changed from Human to Kasatha (both humanoid)
- **THEN** the character's saved description values are unchanged

#### Scenario: Cross-type race swap clears values
- **WHEN** a character's race is changed from Human (humanoid) to Android (android)
- **THEN** all of the character's `character_descriptions` rows are deleted
