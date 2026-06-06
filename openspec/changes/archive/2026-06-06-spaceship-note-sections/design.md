## Context

The spaceship editor (`_name-editor.tsx`) currently supports structured fields (stats, shields, hull) and a weapons section with per-arc sub-lists. Players have no way to record freetext information about ship systems, expansion bays, cargo/passengers, or miscellaneous notes.

The weapons pattern uses a dedicated `spaceship_weapons` table with an `arc` discriminator column. The new note sections follow the same shape but are simpler — each entry is a single text string, no sub-fields.

## Goals / Non-Goals

**Goals:**
- Add four freetext note-list sections to the spaceship editor: Systems, Expansion Bays, Cargo/Passengers, Notes
- Players can add and delete individual note lines per section
- Notes persist to the database tied to the spaceship

**Non-Goals:**
- Reordering notes
- Editing an existing note in-place (delete and re-add is sufficient)
- Rich text or markdown rendering

## Decisions

### Single `spaceship_notes` table with a `section` column

**Decision**: One table with a `section: text` column rather than three or four separate tables.

**Rationale**: All four sections are structurally identical — `(spaceshipId, section, note)`. A single table keeps the migration, query functions, and server actions minimal. The `section` value is app-controlled (never user input), so an enum or constrained text is safe. Using plain `text` (not a pg enum) avoids needing a new migration if a section is renamed or added later.

**Alternative considered**: Separate tables per section. Rejected — identical schemas, 4× the boilerplate, no query benefit.

### UI mirrors the weapons-per-arc pattern

**Decision**: Render each section as a stacked list of note rows + a single text input + Add button, identical in structure to the weapons-per-arc blocks.

**Rationale**: The pattern is already established and familiar. The only simplification is one input field instead of four (name/damage/range/special).

### Server actions follow the same auth pattern

`createSpaceshipNoteAction` and `deleteSpaceshipNoteAction` both check `isCampaignParticipant` before writing, matching all other spaceship actions.

## Risks / Trade-offs

- **No ordering**: Notes display in insertion order (`createdAt ASC`). If players want to reorder, they must delete and re-add. Acceptable for now.
- **Section key is a plain string**: A typo in a section constant would silently create notes in a phantom section. Mitigated by using a `SECTIONS` constant array as the single source of truth for valid values.

## Migration Plan

1. Write and apply a Drizzle migration adding the `spaceship_notes` table
2. Deploy — no backfill needed, table starts empty
3. Rollback: drop `spaceship_notes` (no data loss to existing sheets)
