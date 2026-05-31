## Context

Currently `characters.equipped_armor_id` is a direct FK into the `armor` reference catalog. There is no concept of inventory — a character simply "points at" a catalog entry. The weapons feature already introduced the correct pattern: a `character_weapons` join table that represents ownership, separate from the reference data.

This change brings armor in line with that pattern, replacing the single FK with a `character_armor` join table that supports multiple owned pieces, one of which can be marked `worn`.

## Goals / Non-Goals

**Goals:**
- Characters can own multiple armor pieces from the reference catalog
- Exactly one armor at a time can be `worn`; worn armor's EAC/KAC bonuses apply to stats
- UI matches the weapons inventory pattern: list + "Add Armor" picker
- Worn flag toggled via checkbox; application ensures only one is worn at a time

**Non-Goals:**
- Migrating existing `equipped_armor_id` data (acceptable to discard)
- Armor upgrades / modification slots (future concern)
- Duplicate ownership prevention (same armor can be added twice if desired)

## Decisions

### 1. Application-level "one worn at a time" enforcement

The worn constraint is enforced in the toggle-worn service method: when setting `worn = true` for a row, all other `character_armor` rows for that character are set to `worn = false` in the same database transaction.

**Alternative considered:** Partial unique index `UNIQUE WHERE worn = true`. Drizzle ORM support for partial indexes is limited and adds migration complexity. Application-level enforcement is sufficient for this app's concurrency profile (single user per character sheet).

### 2. Separate UUID primary key on character_armor

`character_armor` uses its own `id` UUID as primary key rather than a composite `(character_id, armor_id)` like `character_weapons`. This allows the same armor to be added twice (two separate rows) and makes row targeting in actions unambiguous.

**Alternative considered:** Composite PK preventing duplicate armor. Rejected — the proposal explicitly allows duplicates, and composite PKs complicate the "remove specific row" action.

### 3. Query boundary unchanged downstream

`getCharacterById` will continue to return `equippedArmor: Armor | null` by joining `character_armor WHERE worn = true` then joining `armor`. All downstream consumers (stats, KAC/EAC, ACP, skills) require no changes.

### 4. New component replaces ArmorPicker

`armor-picker.tsx` is deleted. A new `armor-inventory.tsx` component owns the full list + add/remove/toggle-worn interactions, mirroring `inventory-section.tsx`'s weapon card pattern.

## Risks / Trade-offs

- **Data loss on migration**: existing `equipped_armor_id` values are abandoned. Accepted — the change proposal documents this explicitly.
- **Concurrent toggle race**: two simultaneous toggle-worn requests could both succeed, leaving two rows worn. Acceptable given single-user character ownership model; a DB constraint can be added later if needed.

## Migration Plan

1. Write Drizzle migration: add `character_armor` table, drop `equipped_armor_id` from `characters`
2. Deploy — no data backfill needed
3. Rollback: re-add `equipped_armor_id` (nullable, defaults NULL — safe to re-add with no data)
