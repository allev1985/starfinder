## Context

The app uses Supabase (Postgres via Drizzle ORM) for structured data and Supabase Auth for identity. Supabase Storage (S3-compatible) is already configured but not yet used for user content. Session notes can grow large and are unstructured narrative text, making blob storage a natural fit. The campaign layout already gates all routes under `/dashboard/campaigns/[id]/` behind `isCampaignParticipant`, so new session routes inherit that auth gate at the layout level.

The existing "Session notes" tile on the campaign overview page is a dead button — wiring it up is the UI entry point.

## Goals / Non-Goals

**Goals:**
- Store session note content as blobs in Supabase Storage; keep only path references and metadata in Postgres
- Allow any campaign participant to create, read, and edit any note (DM note or any character's note)
- One DM note and one note per campaign character per session; character entries created lazily on first write
- Sessions identified by optional editable number, free-form title, and optional date
- Auto-save using the existing 600 ms debounce pattern

**Non-Goals:**
- Rich-text / markdown rendering (plain textarea)
- Note history or versioning
- Per-note access control (everyone in the campaign sees and edits everything)
- Real-time collaborative editing (last write wins on save)
- Attachments or images embedded in notes

## Decisions

### Decision: Supabase Storage over storing text in Postgres

**Chosen**: Supabase Storage blobs, paths stored in DB.

**Alternatives considered**:
- Postgres `text` columns inline — technically viable (no size limit), but conflates structured and unstructured data and makes the schema heavier over time.
- External object store (S3, R2) — adds an unneeded dependency when Supabase Storage is already available.

**Rationale**: Explicit architectural separation of unstructured content from structured data. Storage also provides a natural home for future attachments or images without schema changes.

### Decision: Server-side-only blob access via Server Actions

**Chosen**: All reads and writes to Supabase Storage go through Next.js Server Actions using the Supabase service-role key. The client never receives a presigned URL or calls the Storage API directly.

**Rationale**: Keeps auth enforcement in one place (campaign participant check in the Server Action). Avoids exposing storage paths or bucket configuration to the client. Consistent with how the rest of the app handles mutations.

### Decision: One blob per author per session (not one merged document)

**Chosen**: `dm` blob + one blob per character, each stored at a separate path.

**Alternatives considered**:
- Single JSON blob per session with all notes embedded — simpler path structure but requires read-modify-write on every save, creating race conditions when multiple authors are active.

**Rationale**: Independent blobs mean each author's save is an atomic overwrite of their own path. No merge conflicts. Authorization remains trivially simple (membership check only).

### Decision: Lazy character-entry creation

**Chosen**: `session_note_character_entries` rows are inserted on the first write to a character's blob, not pre-populated when a session is created.

**Rationale**: Avoids needing to know the full party roster at session creation time, and keeps the session creation path simple. The detail page queries `campaignCharacters` to display all characters regardless of whether their entry row exists yet.

### Decision: Storage paths use session UUID, not session number

**Chosen**: `campaigns/{campaignId}/sessions/{sessionId}/dm` and `campaigns/{campaignId}/sessions/{sessionId}/chars/{characterId}`.

**Rationale**: Session number is user-editable and not guaranteed unique. The UUID is stable and collision-free.

## Risks / Trade-offs

- **Extra round-trips on page load** — each visible note requires a separate blob read. For a party of 6 that's 7 Storage reads on load. Mitigation: fetch blobs in parallel (`Promise.all`); acceptable latency for an occasionally-viewed page.
- **Last-write-wins on concurrent edits** — two participants editing the same textarea simultaneously will silently overwrite each other. Mitigation: acceptable for the use case (notes are not typically edited by two people simultaneously); document in-app if needed.
- **Blob orphans on session delete** — deleting a session row leaves blobs in Storage. Mitigation: Server Action for session delete also lists and deletes blobs under `campaigns/{campaignId}/sessions/{sessionId}/` before removing the DB row.

## Migration Plan

1. Add `session_notes` and `session_note_character_entries` tables to `src/db/schema.ts`
2. Run `npm run db:generate` to produce the migration SQL
3. Create `session-notes` bucket in Supabase Storage (private, no public access)
4. Deploy — no data migration needed (new tables are empty)
5. Rollback: drop both tables and delete the bucket (no existing data at risk)

## Open Questions

- None — all decisions confirmed during explore session.
