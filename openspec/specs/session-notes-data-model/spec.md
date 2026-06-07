## Requirements

### Requirement: session_notes table
The system SHALL define a `session_notes` table in `src/db/schema.ts` with columns: `id` (uuid PK), `campaignId` (fk → campaigns, cascade delete), `sessionNumber` (integer, nullable), `title` (text, not null), `sessionDate` (date, nullable), `dmStoragePath` (text, nullable), `createdAt` (timestamp with timezone).

#### Scenario: Session row created
- **WHEN** a campaign participant creates a new session
- **THEN** a row is inserted into `session_notes` with the given title and campaignId; sessionNumber, sessionDate, and dmStoragePath may be null

#### Scenario: Session deleted cascades
- **WHEN** a session_notes row is deleted
- **THEN** all related `session_note_character_entries` rows are also deleted via cascade

### Requirement: session_note_character_entries table
The system SHALL define a `session_note_character_entries` table in `src/db/schema.ts` with columns: `id` (uuid PK), `sessionNoteId` (fk → session_notes, cascade delete), `characterId` (fk → characters, cascade delete), `storagePath` (text, not null), `updatedAt` (timestamp with timezone). A unique index SHALL enforce one entry per (sessionNoteId, characterId) pair.

#### Scenario: Entry created on first write
- **WHEN** a participant saves text to a character's note for the first time
- **THEN** a `session_note_character_entries` row is upserted with the storagePath

#### Scenario: Duplicate entry rejected
- **WHEN** an insert is attempted for a (sessionNoteId, characterId) pair that already exists
- **THEN** the upsert updates the existing row rather than inserting a duplicate

### Requirement: Supabase Storage bucket for session note blobs
The system SHALL use a private Supabase Storage bucket named `session-notes`. Blob paths SHALL follow the convention `campaigns/{campaignId}/sessions/{sessionId}/dm` for the DM note and `campaigns/{campaignId}/sessions/{sessionId}/chars/{characterId}` for character notes.

#### Scenario: DM note blob written
- **WHEN** a Server Action writes the DM note
- **THEN** the blob is stored at `campaigns/{campaignId}/sessions/{sessionId}/dm` in the `session-notes` bucket and `dmStoragePath` on the session row is updated

#### Scenario: Character note blob written
- **WHEN** a Server Action writes a character's note
- **THEN** the blob is stored at `campaigns/{campaignId}/sessions/{sessionId}/chars/{characterId}` and the corresponding `session_note_character_entries` row is upserted

#### Scenario: Session deleted cleans up blobs
- **WHEN** a session is deleted
- **THEN** the Server Action removes all blobs under `campaigns/{campaignId}/sessions/{sessionId}/` before deleting the DB row

### Requirement: DB queries for session note operations
The system SHALL provide query functions in `src/db/queries/campaigns.ts` for: listing sessions by campaign (newest first), getting a single session with its character entries, creating a session, updating session metadata (title, sessionNumber, sessionDate, dmStoragePath), upserting a character entry, and deleting a session.

#### Scenario: List sessions returns newest first
- **WHEN** `listSessionsByCampaign(campaignId)` is called
- **THEN** it returns all session rows for that campaign ordered by `createdAt` descending

#### Scenario: Get session with entries
- **WHEN** `getSessionWithEntries(sessionId)` is called
- **THEN** it returns the session row and all associated `session_note_character_entries` rows

### Requirement: Server Actions gate storage access behind campaign membership
All Server Actions that read or write blobs SHALL verify that the calling user is a campaign participant before performing any Storage operation.

#### Scenario: Non-participant blocked from blob read
- **WHEN** a user who is not a campaign participant calls a note-reading Server Action
- **THEN** the action throws an authorization error and no blob is read

#### Scenario: Non-participant blocked from blob write
- **WHEN** a user who is not a campaign participant calls a note-saving Server Action
- **THEN** the action throws an authorization error and no blob is written
