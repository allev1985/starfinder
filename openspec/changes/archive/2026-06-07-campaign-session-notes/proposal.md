## Why

Campaign participants have no place to record what happened each session — the DM needs to keep an overall narrative log and each character's player wants their own perspective. Session notes can grow large, so content should live in Supabase Storage with only lightweight metadata and path references in the database.

## What Changes

- **New**: `session_notes` table — one row per campaign session with title, optional session number (editable), optional date, and a `dmStoragePath` reference to the DM's blob
- **New**: `session_note_character_entries` table — one row per (session, character) pair, holding the `storagePath` reference; lazily created on first write
- **New**: Supabase Storage bucket `session-notes` — blobs written and read exclusively server-side via Server Actions; clients never touch storage directly
- **New**: `/dashboard/campaigns/[id]/sessions` — paginated list of sessions, sorted newest first; any campaign participant can create a session
- **New**: `/dashboard/campaigns/[id]/sessions/[sessionId]` — session detail page showing DM note + one textarea per campaign character; debounced auto-save (600 ms) on any change; any participant can edit any field
- **Modified**: Campaign sidebar gains a "Sessions" nav entry (parallel to the existing Spaceship entry)
- **Modified**: Campaign overview wires the existing "Session notes" tile to the sessions list route

## Capabilities

### New Capabilities

- `session-notes-data-model`: DB tables (`session_notes`, `session_note_character_entries`) and Supabase Storage bucket layout; DB queries and Server Actions for CRUD; lazy character-entry creation on first write
- `session-notes-list`: Sessions list page at `/campaigns/[id]/sessions` — list, create, and delete sessions; sorted newest first; creation open to any participant
- `session-note-detail`: Session detail page at `/campaigns/[id]/sessions/[sessionId]` — DM note textarea + per-character textareas; debounced 600 ms auto-save writing blobs via Server Action; session metadata (title, number, date) editable inline

### Modified Capabilities

- `campaign-session-layout`: Sidebar needs a Sessions nav entry with active-highlight behaviour, parallel to the existing Spaceship entry
- `db-schema`: Two new tables (`session_notes`, `session_note_character_entries`) and their inferred TypeScript types

## Impact

- `src/db/schema.ts` — two new tables, two new type exports
- `supabase/migrations/` — new migration for the two tables
- `src/db/queries/campaigns.ts` — new queries: list/get/create/delete session notes, upsert character entries, fetch storage paths
- `src/app/dashboard/campaigns/[id]/sessions/` — new route segment with `page.tsx` (list) and `[sessionId]/page.tsx` (detail)
- `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx` — add Sessions nav link
- `src/app/dashboard/campaigns/[id]/page.tsx` — wire the "Session notes" tile to the sessions list route
- `src/app/dashboard/campaigns/[id]/sessions/actions.ts` — Server Actions for blob read/write and DB mutations
- Supabase project: new `session-notes` storage bucket (private)
