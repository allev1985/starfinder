## ADDED Requirements

### Requirement: session_notes and session_note_character_entries tables in schema
The system SHALL define `session_notes` and `session_note_character_entries` tables in `src/db/schema.ts` using Drizzle's `pgTable` helper and export the corresponding inferred TypeScript types (`SessionNote`, `NewSessionNote`, `SessionNoteCharacterEntry`, `NewSessionNoteCharacterEntry`).

#### Scenario: Schema exports are typed
- **WHEN** a developer uses `typeof sessionNotes.$inferSelect`
- **THEN** TypeScript resolves the correct row shape including nullable fields for `sessionNumber`, `sessionDate`, and `dmStoragePath`

#### Scenario: Unique index on character entries
- **WHEN** a developer inspects the `session_note_character_entries` table definition
- **THEN** a unique index on `(sessionNoteId, characterId)` is present in the schema
