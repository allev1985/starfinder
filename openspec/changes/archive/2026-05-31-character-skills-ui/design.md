## Context

The skills and class_skills reference tables are seeded and in schema but never queried in the UI. Characters have no way to select, rank, or view their skills. The character page already follows a pattern of per-section client components with debounced saves (see `ability-scores-section.tsx`). This change extends that pattern to skills.

## Goals / Non-Goals

**Goals:**
- Introduce `character_skills` as the join table between characters and their chosen skills
- Add `skill_ranks_per_level` to `classes` so the ranks budget can be computed
- Render a Skills section on the character page with full total derivation
- Support Profession multi-entry via a freetext `label` column
- Match existing UX patterns: debounced saves, owner-gated editing, shadcn components

**Non-Goals:**
- Trained-only enforcement (no hard block on allocating ranks to trained-only skills with 0 ranks)
- Multi-level rank history (ranks budget is computed as a flat formula against current level/INT)
- Skill feat interactions or conditional modifiers beyond the four components (ranks, class bonus, ability mod, misc)
- Bulk-import or auto-suggest of skills based on class

## Decisions

### `character_skills` has no composite unique constraint
Profession requires multiple rows with the same `skill_id` for one character. A partial unique index `UNIQUE(character_id, skill_id) WHERE label IS NULL` is technically correct but complex to manage in Drizzle. Instead, uniqueness for non-Profession skills is enforced at the application layer (Add Skills dialog pre-checks already-added skills and prevents double-save for non-Profession rows). This keeps the migration simple and avoids conditional index logic.

**Alternative considered:** Composite unique on `(character_id, skill_id, label)` with an empty string default. Rejected — empty string semantics are ambiguous and the NULL approach is cleaner at the DB level even if we forgo the constraint.

### Ranks and misc_mod save individually per field (debounced), not as a batch row save
Consistent with the existing debounced save pattern (`useDebouncedSave`). Each input triggers its own server action. This avoids optimistic-update complexity and keeps actions small and focused.

**Alternative considered:** A single "save row" action. Rejected — adds coupling between two independent fields and breaks the established per-field pattern.

### Add Skills dialog uses a controlled checklist with a special Profession sub-list
The dialog fetches all 20 skills plus the character's class_skills set on open. Profession is rendered as a collapsible list of text inputs rather than a simple checkbox. On Save, the dialog computes the diff (added skills, removed skills) and calls a single server action that does batch upserts + deletes inside one transaction.

**Alternative considered:** Separate "Add" and "Remove" actions per skill. Rejected — the multi-select dialog naturally produces a diff; a single transactional save is cleaner and avoids partial failures.

### `skill_ranks_per_level` lives on `classes`, not derived from `classAttributes`
`classAttributes` is a flexible EAV table for display/description data. Skill ranks per level is a computable integer constant per class that feeds a formula — it belongs as a typed column, not a string attribute value.

### Ranks budget formula: `max(1, skillRanksPerLevel + INTmod) × level`
Starfinder CRB rule: minimum 1 rank per level regardless of INT modifier. Since the app stores a flat `level` integer (not per-level history), we assume ranks were allocated uniformly — this matches how the game is played in practice.

## Risks / Trade-offs

- **Multi-profession label collisions** → No DB-level guard against two rows with `skill_id = Profession` and `label = "Doctor"` for the same character. The dialog prevents this in the happy path but concurrent saves or direct API calls could produce duplicates. Mitigation: add a unique index `(character_id, skill_id, label)` in a follow-up once the label-required-for-profession invariant is stable.

- **Stale ranks budget on ability score change** → The budget uses `modifier(intScore)` at render time. If INT changes in `ability-scores-section.tsx`, the skills section won't recompute until the page reloads. Mitigation: pass `intScore` as a prop from the shared client wrapper (`CharacterStatsClient`) so both sections stay in sync within the same page session — no extra fetch needed.

- **No rank allocation guard** → The UI shows budget as informational only; it doesn't prevent over-allocation. This is intentional (house rules, edge cases) but worth revisiting if players want enforcement.

## Migration Plan

1. Add migration `0021_character_skills.sql`:
   - `ALTER TABLE classes ADD COLUMN skill_ranks_per_level INTEGER` with seed UPDATE
   - `CREATE TABLE character_skills` with FK constraints and CASCADE DELETE
2. Update `src/db/schema.ts` to reflect both changes
3. Deploy schema before any UI code ships (additive, non-breaking)
4. Rollback: drop `character_skills` table and `skill_ranks_per_level` column — no existing data depends on them

## Open Questions

- Should the ranks budget show a warning state (red) when over-allocated, or just display the numbers neutrally?
- Is there a maximum level cap to enforce in the ranks budget display (Starfinder goes to 20)?
