## ADDED Requirements

### Requirement: Character notes are stored in a typed database table
The system SHALL store character notes in a `character_notes` table. Each row SHALL capture: `id` (uuid PK), `character_id` (uuid FK → characters, cascade delete), `type` (text, one of `'ability'`, `'proficiency'`, `'note'`), `content` (text, non-empty), and `created_at` (timestamp).

#### Scenario: Note row is created on add
- **WHEN** an owner adds a note to any section
- **THEN** a row exists in `character_notes` with the correct `character_id` and `type`

#### Scenario: Note row is deleted on remove
- **WHEN** an owner removes a note
- **THEN** the corresponding `character_notes` row is deleted

#### Scenario: Deleting a character cascades to character_notes
- **WHEN** a character row is deleted
- **THEN** all rows in `character_notes` for that character are also deleted

### Requirement: Character sheet displays three freeform note sections
The character sheet SHALL display three note sections — **Abilities**, **Proficiencies**, and **Notes** — each backed by the `character_notes` table filtered by type. Each section SHALL allow the character owner to add and remove individual freetext entries.

#### Scenario: Owner adds an entry
- **WHEN** the owner types text into a section's input and presses Enter or clicks Add
- **THEN** the entry appears in that section's list and the input clears

#### Scenario: Add button disabled when input is empty
- **WHEN** the input for a section is empty or whitespace-only
- **THEN** the Add button for that section is disabled

#### Scenario: Owner removes an entry
- **WHEN** the owner clicks the remove button on an entry
- **THEN** that entry is removed from the list

#### Scenario: Non-owner sees read-only list
- **WHEN** a non-owner views the character sheet
- **THEN** the section lists are visible but no add/remove controls are shown

#### Scenario: Empty section shows placeholder
- **WHEN** a section has no entries and the viewer is not the owner
- **THEN** a "No entries" placeholder message is shown

#### Scenario: Notes persist across page reloads
- **WHEN** the character sheet page is reloaded
- **THEN** all previously added entries appear in their respective sections

### Requirement: Notes within each section display in insertion order
Within each section, entries SHALL be displayed in ascending `created_at` order (oldest first).

#### Scenario: Multiple entries display oldest first
- **WHEN** a section has multiple entries added at different times
- **THEN** the earliest-added entry appears at the top of the list
