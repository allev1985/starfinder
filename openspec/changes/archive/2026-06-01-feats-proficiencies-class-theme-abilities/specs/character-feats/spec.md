## ADDED Requirements

### Requirement: character_feats table persists a character's feats
The system SHALL provide a `character_feats` table with columns: `id` (uuid PK), `character_id` (uuid FK → `characters.id`, on delete cascade), `feat_id` (uuid FK → `feats.id`, nullable), `custom_name` (text, nullable), `notes` (text, nullable). Exactly one of `feat_id` or `custom_name` SHALL be non-null per row.

#### Scenario: Adding a reference feat persists feat_id
- **WHEN** a player adds "Improved Initiative" from the feat picker
- **THEN** a `character_feats` row is inserted with the correct `feat_id` and `custom_name = NULL`

#### Scenario: Adding a custom feat persists custom_name
- **WHEN** a player adds a custom feat with a freetext name
- **THEN** a `character_feats` row is inserted with `feat_id = NULL` and the entered `custom_name`

#### Scenario: Deleting character cascades to feats
- **WHEN** a character is deleted
- **THEN** all associated `character_feats` rows are deleted

### Requirement: Feats section displays on character sheet
The character sheet SHALL render a "Feats" section listing all feats the character has taken. Each entry shows the feat name and, for reference-linked feats, access to the full description and prerequisites.

#### Scenario: All character feats are listed
- **WHEN** a character has 3 feats recorded
- **THEN** all 3 are shown in the Feats section

#### Scenario: Reference-linked feat shows description
- **WHEN** a player taps/clicks a reference-linked feat
- **THEN** the full description and prerequisites text from the `feats` table are shown

#### Scenario: Custom feat shows name only
- **WHEN** a custom feat is displayed
- **THEN** the entered name is shown; no description or prerequisites panel is available

#### Scenario: Empty feats section shows prompt
- **WHEN** a character has no feats recorded
- **THEN** the section shows a message indicating no feats have been added

### Requirement: Feat picker searches reference data and supports custom entry
The Feats section SHALL include an "Add Feat" control. Activating it SHALL open a picker that searches the `feats` reference table by name (case-insensitive) and provides a fallback option to add a feat by custom name.

#### Scenario: Typing in the picker filters feats by name
- **WHEN** a player types "focus" in the feat search
- **THEN** results matching "focus" (e.g., "Skill Focus", "Weapon Focus") are shown

#### Scenario: Custom feat option is always available
- **WHEN** a player opens the feat picker
- **THEN** an "Add custom feat" option is available regardless of search results

#### Scenario: Adding a custom feat prompts for a name
- **WHEN** a player selects "Add custom feat"
- **THEN** they are prompted to enter the feat name before the row is saved

### Requirement: Character feats can be removed
The Feats section SHALL allow the owner to remove a feat from the character.

#### Scenario: Removing a feat deletes the character_feats row
- **WHEN** a player removes a feat from the list
- **THEN** the `character_feats` row is deleted and the feat disappears from the section

#### Scenario: Non-owners cannot remove feats
- **WHEN** a user who does not own the character views the sheet
- **THEN** no remove controls are shown in the Feats section
