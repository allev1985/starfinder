## Context

The `characters` table currently holds only `id`, `name`, `owner_id`, and `created_at`. Starfinder 1e characters require a race, class, and theme — these are static CRB reference values that drive the shape of the character sheet. This design adds three lookup tables seeded with CRB data and wires them to character creation, editing, and display.

## Goals / Non-Goals

**Goals:**
- Three reference tables (`races`, `classes`, `themes`) with CRB seed data
- FK columns on `characters` pointing to each reference table
- Character creation requires all three selections
- Character detail shows race, class, and theme
- Character edit allows changing race, class, and theme

**Non-Goals:**
- Mechanical data (HP per level, saving throws, ability score modifiers, class skills) — future work
- Races from Alien Archive or other supplements — CRB only
- Supplement classes (Biohacker, Vanguard, etc.) — CRB only
- Subrace/subtype mechanics beyond naming (Lashunta Damaya vs. Korasha stored as two separate rows)

## Decisions

### 1. Separate reference tables, not a single `game_options` enum table

Each entity type (race, class, theme) has a distinct identity and will gain distinct columns in the future (HP, ability scores, etc.). Separate tables keep the schema extensible without a polymorphic `type` column smell.

**Alternative considered**: A single `reference_data` table with a `type` discriminator. Rejected — it conflates unrelated entities and complicates future column additions per type.

### 2. Seed data via Drizzle SQL migration, not a separate seed script

Reference data is immutable game content that must be present in every environment. Embedding it in a migration guarantees it runs automatically with `drizzle-kit migrate` — no separate seed step required.

**Alternative considered**: JSON seed files + a `npm run seed` script. Rejected — requires an extra manual step and doesn't integrate with the existing migration workflow.

### 3. FK columns on `characters` nullable in DB, required in form

Making the columns nullable in the DB schema allows the migration to run cleanly on existing character rows without a default. The application layer (server action) enforces all three as required at creation time.

**Alternative considered**: Non-null with a DB default pointing to a placeholder row. Rejected — placeholder rows pollute the reference tables and leak implementation detail into the UI.

### 4. Lashunta stored as two separate rows

`Lashunta (Damaya)` and `Lashunta (Korasha)` have different mechanical profiles. Storing them as two distinct race rows avoids a subtype/variant join and keeps the FK on `characters` a simple scalar.

### 5. Load options server-side in the creation/edit page, pass as props

Races, classes, and themes are loaded once per page render from DB. No client-side fetch needed — these lists change rarely and are small (≤25 rows total).

## Risks / Trade-offs

- [Existing characters have null race/class/theme] → Acceptable — they were created before this feature existed. The UI can show "Unknown" for null values on the detail page.
- [Migration seeds ~25 rows inline] → Minor verbosity in SQL; no real risk.
- [Lashunta split] → A player looking for "Lashunta" in a dropdown will see two entries. UI should label them clearly: "Lashunta (Damaya)" and "Lashunta (Korasha)".

## Migration Plan

1. Run new Drizzle migration: creates `races`, `classes`, `themes` tables and inserts all CRB seed rows
2. Run second migration (or same): adds `race_id`, `class_id`, `theme_id` nullable FK columns to `characters`
3. Deploy app — existing characters show null fields gracefully, new characters require selection
4. No rollback complexity — FK columns are nullable, dropping them is safe if needed
