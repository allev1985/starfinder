## 1. Database

- [x] 1.1 Add `spaceship_notes` table to `src/db/schema.ts` with columns: `id` (uuid PK), `spaceshipId` (uuid FK → spaceships, cascade delete), `section` (text, not null), `note` (text, not null), `createdAt` (timestamp with timezone, defaultNow)
- [x] 1.2 Export `SpaceshipNote` and `NewSpaceshipNote` types from `src/db/schema.ts`
- [x] 1.3 Generate and apply the Drizzle migration

## 2. Query Functions

- [x] 2.1 Add `getNotesBySpaceship(spaceshipId: string)` query to `src/db/queries/campaigns.ts`
- [x] 2.2 Add `createSpaceshipNote(data: NewSpaceshipNote)` query to `src/db/queries/campaigns.ts`
- [x] 2.3 Add `deleteSpaceshipNote(noteId: string)` query to `src/db/queries/campaigns.ts`

## 3. Server Actions

- [x] 3.1 Add `createSpaceshipNoteAction(campaignId, spaceshipId, section, note)` to `src/app/dashboard/campaigns/[id]/spaceship/actions.ts`
- [x] 3.2 Add `deleteSpaceshipNoteAction(campaignId, noteId)` to `src/app/dashboard/campaigns/[id]/spaceship/actions.ts`

## 4. Page Data Fetching

- [x] 4.1 Fetch notes in `src/app/dashboard/campaigns/[id]/spaceship/page.tsx` and pass to `SpaceshipEditor`

## 5. UI

- [x] 5.1 Add `SECTIONS` constant array (`systems`, `expansion_bays`, `cargo_passengers`, `notes`) with display labels to `_name-editor.tsx`
- [x] 5.2 Add `notes` and `noteForms` state to `SpaceshipEditor` (mirroring the weapons pattern)
- [x] 5.3 Add `handleAddNote(section)` and `handleDeleteNote(noteId)` handlers
- [x] 5.4 Render four note-list sections below the Weapons section, each with a list of saved note rows (with × delete button) and a single input + Add button
- [x] 5.5 Disable Add button when input is empty or whitespace

## 6. Verification

- [x] 6.1 Run `npm run lint` and `npx tsc --noEmit` with no errors
- [ ] 6.2 Manually verify: add a note to each section, reload page, confirm notes persist
- [ ] 6.3 Manually verify: delete a note line, confirm it is removed
