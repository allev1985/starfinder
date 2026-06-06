## MODIFIED Requirements

### Requirement: Spaceship editor has four freetext note-list sections placed in spatial zones
The spaceship editor SHALL display four note-list sections. Each section SHALL allow participants to add and delete individual freetext note lines. The sections SHALL be placed in specific layout zones rather than stacked at the bottom:
- `notes` → middle column of the bottom row (alongside Crew and Expansion Bays)
- `expansion_bays` → right column of the bottom row
- `systems` → middle column of the systems row (alongside Power Core+Drift and Cargo)
- `cargo_passengers` → right column of the systems row

#### Scenario: Participant adds a note line
- **WHEN** a participant types text into a section's input and clicks Add (or presses Enter)
- **THEN** the note line appears in that section's list and the input clears

#### Scenario: Add button disabled when input is empty
- **WHEN** the note input for a section is empty or contains only whitespace
- **THEN** the Add button for that section is disabled

#### Scenario: Participant deletes a note line
- **WHEN** a participant clicks the delete button on a note line
- **THEN** that note line is removed from the list

#### Scenario: Notes persist across page reloads
- **WHEN** a participant reloads the spaceship page
- **THEN** all previously added note lines are displayed in their respective sections

#### Scenario: Notes section is in the bottom row middle column
- **WHEN** the spaceship editor renders at viewport ≥ 640px
- **THEN** the general Notes section appears in the middle column of the bottom row, between Crew and Expansion Bays

#### Scenario: Systems section is in the systems row middle column
- **WHEN** the spaceship editor renders at viewport ≥ 640px
- **THEN** the Systems notes section appears in the middle column of the systems row, between Power Core+Drift and Cargo/Passengers

### Requirement: Spaceship notes are stored in the database linked to the spaceship
Each note line SHALL be stored as a row in a `spaceship_notes` table linked to the spaceship by `spaceship_id`. Each row SHALL capture: `id`, `spaceship_id`, `section` (text, app-controlled), `note` (text), and `created_at`. The `section` value SHALL be one of: `systems`, `expansion_bays`, `cargo_passengers`, `notes`.

#### Scenario: Note row is created on add
- **WHEN** a participant adds a note line to any section
- **THEN** a row exists in `spaceship_notes` with the correct `spaceship_id` and `section`

#### Scenario: Note row is deleted on remove
- **WHEN** a participant deletes a note line
- **THEN** the corresponding `spaceship_notes` row is deleted

#### Scenario: Deleting a spaceship cascades to spaceship_notes
- **WHEN** a spaceship row is deleted
- **THEN** all rows in `spaceship_notes` for that spaceship are also deleted

### Requirement: Note sections display in insertion order
Within each section, note lines SHALL be displayed in ascending `created_at` order (oldest first).

#### Scenario: Multiple notes display oldest first
- **WHEN** a section has multiple note lines added at different times
- **THEN** the earliest-added note appears at the top of the list
