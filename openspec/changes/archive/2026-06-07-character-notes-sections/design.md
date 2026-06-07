## Context

The character sheet already has freeform list sections (Languages, Feats) and a typed notes table pattern established by `spaceship_notes`. Players need equivalent sections for abilities, proficiencies, and general notes that don't fit the structured class/theme/feat data model.

The `spaceship_notes` table uses a `section: text` column (app-controlled enum). This change mirrors that pattern for characters via a `character_notes` table with a `type` column.

## Goals / Non-Goals

**Goals:**
- Add `character_notes` table with `type` in `('ability', 'proficiency', 'note')`
- Render three sections in the character sheet's "Abilities & Gear" area
- Owner-only add/remove; read-only view for non-owners
- Consistent with existing section patterns (LanguagesSection, FeatsSection)

**Non-Goals:**
- No ordering/drag-reorder — insertion order (createdAt) is sufficient
- No rich text or description field — content is a single text string per row
- No seeding from reference data — purely manual entries
- No modifier integration — these notes have no mechanical effect on stats

## Decisions

### Single shared component parameterized by type
One `CharacterNotesSection` component accepts a `type` prop (`'ability' | 'proficiency' | 'note'`) and a display `title`. It is rendered three times in `CharacterSheet`. This avoids three near-identical components.

**Alternative considered**: Three separate components. Rejected — no meaningful behavioral difference between types; parameterization is cleaner.

### `type` as plain text column (not Postgres enum)
Mirrors `spaceship_notes.section` which uses `text`. Avoids a Postgres enum migration that would complicate future type additions.

**Alternative considered**: Postgres `CREATE TYPE`. Rejected — adds migration complexity with no runtime benefit given the app controls all inserts.

### Notes loaded in `loadCharacterSheetData`, passed through `CharacterStatsClient`
Consistent with how all other character sheet data flows. Notes are fetched server-side and passed as a prop, then stored in `CharacterContext` for client-side add/remove optimistic updates.

### Context stores notes as a flat array; components filter by type
Rather than grouping server-side into `{ ability: [], proficiency: [], note: [] }`, the context holds a flat `CharacterNote[]` and each section component filters. This keeps the context shape simple and avoids nested partial updates.

## Risks / Trade-offs

- **Schema migration required** → Use Drizzle `migrate` with a forward-only migration; rollback drops the table (no data loss risk since it's new)
- **No optimistic ID** → On add, we get the real UUID back from the server action returning the inserted row; no temp-ID swap needed. This matches `addFeatAction` returning success/failure but here we return the full row to get the real `id`.

## Migration Plan

1. Add `characterNotes` table to `src/db/schema.ts`
2. Generate migration: `npx drizzle-kit generate`
3. Apply migration: `npx drizzle-kit migrate` (or via Supabase MCP)
4. Deploy app code referencing the new table
