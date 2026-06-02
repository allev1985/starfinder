## Context

The character sheet already renders most combat stats, skills, spells, armor, and equipment. Four fields from the Starfinder PDF are unimplemented: DR/Resistances (from worn armor), Credits, XP Earned, and Languages. All are character-scoped data and follow the same pattern as existing fields: schema column → server action → debounced client component.

## Goals / Non-Goals

**Goals:**
- Add `dr` and `resistances` text columns to the `armor` reference table; display them read-only in the Armor Class section when armor is worn
- Add `credits` (integer) and `xp_earned` (integer) to the `characters` table; expose as editable fields with debounced save
- Add `languages` (text[]) to the `characters` table; render as an add/remove tag list

**Non-Goals:**
- Carrying capacity thresholds (separate future change)
- Spell slots used / spells per day tracking
- Skill notes or armor notes free-text fields
- Any UI changes to the armor reference admin or seeding scripts

## Decisions

### DR / Resistances live on the `armor` reference table
The PDF places DR and Resistances in the Armor Class section, implying they are properties of the worn armor (e.g., powered armor has inherent DR). Storing them as text on the `armor` row (nullable, defaulting to empty string) lets the reference data drive the display with no per-character storage needed. The combat stats section reads `equippedArmor.dr` / `equippedArmor.resistances` and displays them inline, showing "—" when null or empty. Existing armor rows default to null (no DR/resistances), which is correct for most light/heavy armor.

**Alternative considered:** Per-character editable fields. Rejected because DR is an intrinsic armor property, not something a player sets manually.

### Credits and XP on the `characters` table
Both are single integer values scoped to a character. Adding them as columns to `characters` is the simplest path — no join needed, consistent with how `level`, `strScore`, etc. are stored.

### Languages as a text array on `characters`
Languages are a simple list of strings (e.g., "Common", "Vesk"). A `text[]` Postgres column avoids a join table for what amounts to a small list. The UI renders each language as a removable badge plus an inline text input to add new ones. No reference table is needed.

### Save pattern: debounced onChange (600ms)
Consistent with the existing pattern in `ability-scores-section.tsx`. The credits and XP fields use a numeric input with a 600 ms debounce calling a server action. Languages add/remove are instant (no debounce needed since each operation is atomic).

## Risks / Trade-offs

- **DR/Resistances are free text** — no validation of format (e.g., "5/magic"). This is intentional; Starfinder DR notation varies and validation would be over-engineering.
- **Null DR/Resistances on existing armor rows** — the `armor` table already has data. The migration adds nullable columns; the UI shows "—" for null, which is correct.
- **languages text[] vs join table** — if language names ever need to be constrained to a reference list, migrating from text[] to a join table is straightforward. For now the open-ended list is more useful.

## Migration Plan

1. Run Supabase migration to add columns to `armor` (dr, resistances) and `characters` (credits, xp_earned, languages)
2. Update `src/db/schema.ts` to reflect new columns
3. Update queries in `src/db/queries/characters.ts` to return new fields
4. Add server actions for credits, XP, and languages
5. Update `combat-stats-section.tsx` to receive and display DR/Resistances from equipped armor
6. Add `credits-xp-section.tsx` component for Credits + XP Earned with debounced save
7. Add `languages-section.tsx` component for tag list
8. Wire new components into `character-stats-client.tsx` and `page.tsx`

Rollback: revert schema columns (no data loss risk since all new columns have defaults).
