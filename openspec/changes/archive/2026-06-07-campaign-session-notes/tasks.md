## 1. Database Schema

- [x] 1.1 Add `session_notes` table to `src/db/schema.ts` (id, campaignId fk, sessionNumber nullable int, title text, sessionDate date nullable, dmStoragePath text nullable, createdAt)
- [x] 1.2 Add `session_note_character_entries` table to `src/db/schema.ts` (id, sessionNoteId fk cascade, characterId fk cascade, storagePath text, updatedAt; unique index on sessionNoteId+characterId)
- [x] 1.3 Export `SessionNote`, `NewSessionNote`, `SessionNoteCharacterEntry`, `NewSessionNoteCharacterEntry` types from `src/db/schema.ts`
- [x] 1.4 Run `npm run db:generate` to produce the migration SQL
- [x] 1.5 Apply the migration (`npm run db:migrate` or push to Supabase)

## 2. Storage Bucket

- [x] 2.1 Create the `session-notes` bucket in Supabase Storage (private, no public access)

## 3. DB Queries

- [x] 3.1 Add `listSessionsByCampaign(campaignId)` to `src/db/queries/campaigns.ts` — returns sessions ordered by `createdAt` desc
- [x] 3.2 Add `getSessionWithEntries(sessionId)` — returns session row + all character entries
- [x] 3.3 Add `createSession(data)` — inserts a session row and returns it
- [x] 3.4 Add `updateSessionMetadata(sessionId, data)` — updates title, sessionNumber, sessionDate, dmStoragePath
- [x] 3.5 Add `upsertCharacterEntry(sessionNoteId, characterId, storagePath)` — insert-or-update on unique key
- [x] 3.6 Add `deleteSession(sessionId)` — deletes the session row (character entries cascade)

## 4. Server Actions

- [x] 4.1 Create `src/app/dashboard/campaigns/[id]/sessions/actions.ts` with `createSession` action (validates participant, inserts row, redirects to detail)
- [x] 4.2 Add `saveSessionMetadata` action (validates participant, calls `updateSessionMetadata`)
- [x] 4.3 Add `saveDmNote(campaignId, sessionId, content)` action — validates participant, writes blob to Storage at `campaigns/{campaignId}/sessions/{sessionId}/dm`, updates `dmStoragePath` on first write
- [x] 4.4 Add `saveCharacterNote(campaignId, sessionId, characterId, content)` action — validates participant, writes blob, upserts character entry
- [x] 4.5 Add `deleteSession(campaignId, sessionId)` action — validates participant, lists and deletes all blobs under `campaigns/{campaignId}/sessions/{sessionId}/`, deletes DB row
- [x] 4.6 Add `loadSessionNoteContent(campaignId, sessionId)` action — validates participant, fetches DM blob and all character blobs in parallel, returns content map

## 5. Sessions List Page

- [x] 5.1 Create `src/app/dashboard/campaigns/[id]/sessions/page.tsx` — server component; loads sessions via `listSessionsByCampaign`; renders list sorted newest first
- [x] 5.2 Render empty state with create-session prompt when no sessions exist
- [x] 5.3 Add create-session form/dialog (title required, sessionNumber and sessionDate optional); submit calls `createSession` action
- [x] 5.4 Each session entry links to `/dashboard/campaigns/[id]/sessions/[sessionId]`

## 6. Session Detail Page

- [x] 6.1 Create `src/app/dashboard/campaigns/[id]/sessions/[sessionId]/page.tsx` — server component; loads session row, campaign characters, and all note content via `loadSessionNoteContent`
- [x] 6.2 Render inline-editable fields for title, sessionNumber, and sessionDate with 600 ms debounced save via `saveSessionMetadata`
- [x] 6.3 Render DM note textarea pre-populated from blob; 600 ms debounced save via `saveDmNote`
- [x] 6.4 Render one textarea per campaign character pre-populated from blob; 600 ms debounced save via `saveCharacterNote`
- [x] 6.5 Add delete session button (DM-only visibility); calls `deleteSession` action and redirects to sessions list

## 7. Navigation Wiring

- [x] 7.1 Add Sessions nav entry to `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx` below the Spaceship entry, with active-highlight for `/sessions` routes
- [x] 7.2 Wire the "Session notes" tile on the campaign overview page (`page.tsx`) to link to `/dashboard/campaigns/[id]/sessions`

## 8. Lint & Type Check

- [x] 8.1 Run `npm run lint` and fix any issues
- [x] 8.2 Run `npx tsc --noEmit` and fix any type errors
