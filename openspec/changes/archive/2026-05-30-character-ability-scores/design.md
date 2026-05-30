## Context

The `characters` table currently stores character identity (name, owner, race, class, theme, level). Ability scores are a core, fixed set of 6 values in Starfinder 1e that every character has. The character sheet page already has an auto-save-on-blur pattern established by `DescriptionSection`.

## Goals / Non-Goals

**Goals:**
- Store the 6 ability scores as columns on `characters` (simple, fast, no joins)
- Show an Ability Scores section on the character sheet with score inputs and derived modifiers
- Derive modifier client-side; never store it
- Owner-editable, non-owner read-only — consistent with existing sheet sections

**Non-Goals:**
- Calculating or applying racial ability score adjustments automatically
- Validating score ranges (trust the player)
- Separate ability score history or versioning

## Decisions

### Store as columns on `characters`, not a separate table

Starfinder 1e has exactly 6 fixed ability scores. A separate key-value table (`character_ability_scores`) adds a join and indirection for no benefit. Adding 6 `INTEGER` columns directly mirrors how `level` is stored and keeps the character record self-contained.

**Alternative considered:** JSONB column — rejected for being less type-safe and harder to query.

### Default to 10, nullable in schema

Columns default to `10` so new characters have a valid, neutral baseline (+0 modifier). Existing characters without scores set will read as 10 after the migration. This avoids null-checking in the modifier formula.

### Modifier computed client-side only

`floor((score - 10) / 2)` is pure arithmetic. Storing the modifier would create a derived-data consistency problem. The client computes and displays it reactively as the user types; the server only persists the score.

### Single server action for all 6 scores

Ability scores are logically a unit — a player typically sets them all at character creation. A single `updateAbilityScoresAction(characterId, scores)` accepting all 6 values avoids 6 separate round-trips. The auto-save fires per-field on blur, but still calls the same action (with all current values passed in).

**Alternative considered:** One action per ability — rejected as over-granular for what is effectively one update to a single row.

## Risks / Trade-offs

- **Existing characters get default 10 scores** → Acceptable; players will update them. No data loss.
- **No per-field undo** → Consistent with `DescriptionSection` pattern; acceptable for a game sheet.

## Migration Plan

1. Add migration: `ALTER TABLE characters ADD COLUMN str_score INTEGER NOT NULL DEFAULT 10, ...` (all 6 columns in one statement)
2. Deploy — existing rows automatically get `10` for all scores
3. No rollback complexity; columns can be dropped if reverted
