## Requirements

### Requirement: Session detail page at /campaigns/[id]/sessions/[sessionId]
The system SHALL provide a page at `/dashboard/campaigns/[id]/sessions/[sessionId]` that displays the session's DM note and one note textarea per campaign character. The page SHALL be accessible to any campaign participant.

#### Scenario: Page loads with existing note content
- **WHEN** a campaign participant navigates to a session detail page
- **THEN** the DM note textarea is populated with the existing DM blob content (or empty if no blob exists yet) and each character's textarea is populated with their blob content (or empty)

#### Scenario: All campaign characters shown
- **WHEN** the session detail page loads
- **THEN** a textarea is rendered for every character currently in the campaign, regardless of whether that character has written a note for this session

### Requirement: Session metadata is editable inline
The session title, session number, and date SHALL be editable directly on the detail page. Changes SHALL be saved via debounced Server Action (600 ms).

#### Scenario: Participant edits session title
- **WHEN** a participant changes the session title field and pauses for 600 ms
- **THEN** the new title is persisted to the `session_notes` row

#### Scenario: Participant edits session number
- **WHEN** a participant changes the session number field and pauses for 600 ms
- **THEN** the new number is persisted (or null if cleared)

#### Scenario: Participant edits session date
- **WHEN** a participant changes the session date field and pauses for 600 ms
- **THEN** the new date is persisted (or null if cleared)

### Requirement: DM note auto-saves to blob storage
The DM note textarea SHALL auto-save its content to Supabase Storage via Server Action after 600 ms of inactivity following a change. The `dmStoragePath` on the session row SHALL be updated on first write.

#### Scenario: Participant edits DM note
- **WHEN** any campaign participant types in the DM note textarea and pauses for 600 ms
- **THEN** the blob at `campaigns/{campaignId}/sessions/{sessionId}/dm` is written with the new content and `dmStoragePath` is set on the session row if not already set

### Requirement: Character notes auto-save to blob storage
Each character note textarea SHALL auto-save its content to Supabase Storage via Server Action after 600 ms of inactivity. A `session_note_character_entries` row SHALL be upserted on first write.

#### Scenario: Participant edits a character note
- **WHEN** any campaign participant types in a character's note textarea and pauses for 600 ms
- **THEN** the blob at `campaigns/{campaignId}/sessions/{sessionId}/chars/{characterId}` is written and the `session_note_character_entries` row is upserted

### Requirement: Any participant can edit any note
Any campaign participant SHALL be able to edit the DM note or any character's note on the session detail page. No ownership check beyond campaign membership is performed.

#### Scenario: Player edits the DM note
- **WHEN** a player (non-DM) edits the DM note textarea
- **THEN** the change is saved successfully

#### Scenario: DM edits a character's note
- **WHEN** the DM edits a character note textarea
- **THEN** the change is saved successfully
