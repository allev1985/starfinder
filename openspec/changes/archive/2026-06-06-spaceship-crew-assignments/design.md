## Context

The spaceship editor is a single long client component (`_name-editor.tsx`) with debounced saves. Campaign characters are already linked to a campaign via the `campaign_characters` join table. The spaceship belongs to the same campaign, so the characters are already accessible — we just need a bridge table to persist role assignments and a UI section at the bottom of the editor.

## Goals / Non-Goals

**Goals:**
- Persist crew role assignments in the database
- Enforce at most one captain and one pilot per spaceship at the DB level
- Allow any number of engineers, gunners, and science officers
- Allow a single character to hold multiple roles simultaneously
- Display assigned characters by name only within each role group

**Non-Goals:**
- Reordering the spaceship editor sections (deferred)
- Showing character stats (e.g. Piloting rank) alongside names
- Read-only mode for non-DM participants (existing spaceship constraint; not new work here)
- Real-time sync across participants

## Decisions

### D1: Partial unique index for singleton roles

A single `spaceship_crew` table with a partial unique index on `(spaceship_id, role)` WHERE role IN (`captain`, `pilot`) enforces the one-per-ship constraint at the database level without splitting the model.

**Alternatives considered:**
- Nullable FK columns on the spaceship row (`captain_character_id`, `pilot_character_id`): simpler to query but splits crew data across two code paths and makes multi-slot roles awkward.
- Application-layer enforcement only: fragile, DB can drift.

### D2: New `_crew-section.tsx` client component

Crew assignment is self-contained enough to extract into its own component rather than inflating `_name-editor.tsx` further. The component receives `spaceshipId`, `campaignId`, `characters` (all campaign members), and `initialCrew` (existing assignments).

**Alternative**: inline in `_name-editor.tsx` — rejected because the file is already long.

### D3: Immediate server action (no debounce) for crew changes

Adding or removing a crew member is a discrete user action (button click), not a continuous input. Immediate server actions (no 600 ms debounce) are the right pattern here.

**Contrast**: text/number fields use debounced onChange per the project save pattern — crew uses onClick with immediate save.

### D4: `upsert` pattern for singleton roles

When assigning a new captain/pilot, the server action deletes any existing assignment for that role before inserting the new one. This is safer than a true upsert in Drizzle because it makes the intent explicit and avoids relying on conflict resolution behavior.

## Risks / Trade-offs

- [Race condition on singleton upsert] Two simultaneous captain assignments could both pass the app-layer check before either commits → Mitigation: the partial unique index is the true guard; the second insert fails with a constraint error that the server action surfaces as a user-visible error.
- [Editor file growth] `_name-editor.tsx` is already large; the crew section is extracted to its own file to contain this.

## Migration Plan

1. Write and apply new Supabase migration: `create table spaceship_crew` + partial unique index.
2. Generate updated TypeScript types.
3. Add DB query (`getCrewBySpaceship`) and server actions (`assignCrewAction`, `removeCrewAction`).
4. Add `_crew-section.tsx` component.
5. Wire into `_name-editor.tsx` and the spaceship page query.
6. No data migration needed (new table, no existing rows to transform).
7. Rollback: drop the table and remove the UI component.
