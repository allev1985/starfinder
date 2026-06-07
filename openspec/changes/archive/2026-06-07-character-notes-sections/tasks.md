## 1. Database Schema & Migration

- [x] 1.1 Add `characterNotes` table to `src/db/schema.ts` with columns: `id` (uuid PK), `characterId` (uuid FK → characters cascade), `type` (text), `content` (text), `createdAt` (timestamp)
- [x] 1.2 Export `CharacterNote` and `NewCharacterNote` types from schema
- [x] 1.3 Run `npx drizzle-kit generate` to generate the migration file
- [ ] 1.4 Apply the migration via Supabase MCP (`apply_migration`) ← PENDING: MCP timeout, run manually

## 2. Queries & Server Actions

- [x] 2.1 Add `getCharacterNotes(characterId)` query in `src/db/queries/characters.ts` returning `CharacterNote[]` ordered by `createdAt` asc
- [x] 2.2 Add `addCharacterNoteAction(characterId, type, content)` server action in the character `actions.ts` — inserts a row and returns the inserted `CharacterNote`
- [x] 2.3 Add `removeCharacterNoteAction(characterId, noteId)` server action — deletes the row

## 3. Page Loader & Props

- [x] 3.1 Call `getCharacterNotes(id)` in `loadCharacterSheetData` and include `characterNotes` in the returned object
- [x] 3.2 Pass `characterNotes` from `page.tsx` down to `CharacterStatsClient` as `initialNotes`
- [x] 3.3 Add `initialNotes: CharacterNote[]` to `CharacterStatsClient` Props type and thread it through to `CharacterProvider`

## 4. Character Context

- [x] 4.1 Add `notes: CharacterNote[]` and `setNotes` to `CharacterContext` in `character-context.tsx`
- [x] 4.2 Initialise context state from `initialNotes` prop

## 5. Notes Section Component

- [x] 5.1 Create `src/app/dashboard/characters/[id]/_components/character-notes-section.tsx` — a single component accepting `type: 'ability' | 'proficiency' | 'note'` and `title: string` props
- [x] 5.2 Component reads `notes` from context, filters by `type`, renders each entry as a text row with remove button (owner only)
- [x] 5.3 Owner add control: text input (Enter or Add button) that calls `addCharacterNoteAction` and prepends to local state via `setNotes`; disabled when input is empty/whitespace
- [x] 5.4 Remove handler calls `removeCharacterNoteAction` and filters entry from local state
- [x] 5.5 Show "No entries recorded." placeholder when list is empty and viewer is not owner

## 6. Wire Into Character Sheet

- [x] 6.1 Import `CharacterNotesSection` in `character-stats-client.tsx`
- [x] 6.2 Add three instances to the desktop "Abilities & Gear" tab: `<CharacterNotesSection type="ability" title="Abilities" />` and `<CharacterNotesSection type="proficiency" title="Proficiencies" />` in the left column; `<CharacterNotesSection type="note" title="Notes" />` in the right column
- [x] 6.3 Add the same three instances to the mobile "Abilities & Gear" accordion in the same order

## 7. Lint & Typecheck

- [x] 7.1 Run `npm run lint` and fix any errors
- [x] 7.2 Run `npx tsc --noEmit` and fix any type errors
