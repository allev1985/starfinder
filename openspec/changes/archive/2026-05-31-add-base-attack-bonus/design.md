## Context

The character sheet already has a Combat Stats section that stores data in the `character_combat_stats` table. Health, resolve, and initiative are already there. Base Attack Bonus (BAB) is a fundamental Starfinder combat stat that every character has — it comes from class progression and is always a simple integer the user looks up and enters.

## Goals / Non-Goals

**Goals:**
- Add `base_attack_bonus` column to `character_combat_stats`
- Expose a user-editable input on the character sheet using the existing debounced-save pattern

**Non-Goals:**
- Calculating BAB from class/level — the user enters it manually
- Using BAB to compute other derived values (full attack bonus, etc.)

## Decisions

**Extend `character_combat_stats` rather than add a new table.**
BAB is a combat stat. The existing table is already the home for all combat-related numbers; adding a column there avoids a new join and keeps the data model simple.

**Reuse the debounced `onChange` save pattern.**
All other editable stats on the sheet use a 600 ms debounce on `onChange`. BAB will follow the same pattern for consistency.

## Risks / Trade-offs

- **Migration on existing rows** → New column defaults to `0`, so existing characters will show `0` until the user fills it in. Acceptable because no data is lost and `0` is a valid (if unlikely) BAB.
