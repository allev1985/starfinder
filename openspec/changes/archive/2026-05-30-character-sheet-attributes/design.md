## Context

The `races`, `classes`, and `themes` tables currently hold only `id` and `name`. The character sheet needs to know what fields to render for any combination of race + class + theme. These fields vary entirely by entity — an Android sheet looks different from a Kasatha sheet; a Soldier sheet looks different from a Mystic sheet. All three attribute tables define structure only: the player fills in actual values from their rulebook.

## Goals / Non-Goals

**Goals:**
- Three attribute tables (`race_attributes`, `class_attributes`, `theme_attributes`) with identical column shapes
- `input_type` column (`text` | `boolean`) tells the UI what control to render
- `type` column groups attributes into sections on the sheet (e.g. `movement`, `sense`, `trait`, `feature`, `proficiency`)
- `sort_order` controls display order within each type group
- Full CRB seed data for all 8 races, 7 classes, 10 themes
- Query functions to load attributes by entity ID

**Non-Goals:**
- Pre-filled values — all fields are blank; the player writes values from their rulebook
- Character sheet UI — rendering attributes on the sheet is a follow-on change
- Calculation or automation of any kind
- Non-CRB content

## Decisions

### 1. Three separate tables, not one polymorphic table

Each table has a foreign key to its specific entity (`race_id`, `class_id`, `theme_id`). A single `entity_attributes` table with a `entity_type` discriminator would require nullable FK columns and makes referential integrity harder to enforce.

**Alternative considered**: Single `sheet_attributes` table with `entity_type` + `entity_id` (UUID). Rejected — loses FK constraints and conflates unrelated entities.

### 2. `input_type` as a `text` column constrained to `text` | `boolean` at the app layer

Postgres enums require a migration to add new values. Since `input_type` may grow (e.g. `number`, `select`) as the sheet evolves, a `text` column with Zod validation at the app boundary is more flexible.

### 3. Seed data embedded in the migration SQL

Attribute data is static game content that must exist in every environment. Embedding it in the migration guarantees it runs automatically — no separate seed step. Fixed UUIDs (with a `d`-series prefix for race attrs, `e`-series for class, `f`-series for theme) make the seed idempotent.

### 4. CRB seed data scope

**Races** — movement, senses, and racial traits/abilities per race. Boolean `input_type` for binary traits (e.g. Low-light Vision); text for descriptive fields (e.g. Upgrade Slot contents).

**Classes** — proficiencies, class features by name. No save progressions or HP values — those are calculable and out of scope for a record-keeping sheet.

**Themes** — theme knowledge (the trained skill + bonus) and the level 6 and level 12 theme features, as text fields.

## Risks / Trade-offs

- [Large seed migration] → The SQL will be long (~200 rows across three tables). Acceptable — it's a one-time cost and the data is stable.
- [input_type grows beyond text/boolean] → App-layer Zod validation means adding a new type requires no migration, just a code change.

## Migration Plan

1. Generate migration for the three new tables
2. Append INSERT seed data for all CRB races, classes, and themes
3. Apply locally — no rollback complexity; tables are additive
