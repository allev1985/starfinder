## Context

The current schema stores character description fields (Size, Gender, Home World, etc.) as per-race rows in `race_attributes`. This means the same 7 humanoid fields are duplicated for every biological race, and the only meaningful distinction — humanoid vs android — is implicit in which fields happen to be seeded. `class_attributes` and `theme_attributes` were created with the same pattern but never populated or consumed anywhere in the app.

The change replaces this data-driven pattern with a type-driven one: races are tagged with a `race_type` enum value, and a single shared `race_descriptions` table holds description field definitions per type. Character values are stored in `character_descriptions` keyed by `description_id`.

## Goals / Non-Goals

**Goals:**
- Eliminate duplicated humanoid field definitions across all biological races
- Make humanoid/android distinction explicit in the schema via a Postgres enum
- Simplify race-change logic so values survive same-type race swaps
- Remove unused `class_attributes` and `theme_attributes` dead code

**Non-Goals:**
- Adding description fields for class or theme (out of scope)
- Supporting more than two race types in this change (enum is extensible; initial values are `humanoid` and `android`)
- Migrating existing saved character description data (confirmed clean slate)

## Decisions

### D1: Postgres enum for race_type

**Decision**: Use `CREATE TYPE race_type AS ENUM ('humanoid', 'android')` rather than a plain `TEXT` column on `race_descriptions`.

**Rationale**: A Postgres enum provides DB-level type safety — invalid values are rejected at insert time. The TypeScript side mirrors it as a union `'humanoid' | 'android'`, giving compile-time safety in queries. Adding a new race type later requires a single `ALTER TYPE` migration, which is a low-cost, non-breaking operation for an enum (`ADD VALUE` does not require a table rewrite).

**Alternative considered**: `TEXT` with a check constraint. Achieves the same DB-level enforcement but is less semantically clear and doesn't generate a reusable named type.

### D2: race_descriptions is not FK'd to races

**Decision**: `race_descriptions` has a `race_type race_type NOT NULL` column rather than a `race_id` FK.

**Rationale**: The entire point of this refactor is that description fields belong to a *type*, not an individual race. A FK to `races` would recreate the per-race duplication problem. The join is `races.type = race_descriptions.race_type`, done in app logic.

### D3: character_descriptions mirrors the old character_race_attribute_values shape

**Decision**: `character_descriptions(character_id, description_id, value)` with a composite PK on `(character_id, description_id)`.

**Rationale**: Same semantics as the table it replaces — a character owns a bag of key-value pairs, keyed by the description field ID. Keeping the shape familiar minimises the query rewrite surface.

### D4: Race-change clearing uses type comparison

**Decision**: In `updateCharacterForOwner`, clearing `character_descriptions` is conditioned on the old race's type differing from the new race's type, not simply on `raceId` changing.

**Rationale**: If a player corrects a Human to a Kasatha, both are humanoid — the description values (Gender, Home World, etc.) are still valid and should persist. Only crossing the humanoid ↔ android boundary makes existing values stale.

**Implementation note**: This requires loading `race.type` for both old and new races before deciding whether to wipe. Two lightweight point lookups on the `races` table.

## Risks / Trade-offs

- **Enum migration cost** → Adding a third race type later requires an `ALTER TYPE ... ADD VALUE` migration. This is non-blocking and safe in Postgres but adds a migration step. Acceptable given the stability of Starfinder 1e race categories.
- **All *_attributes data is dropped** → `race_attributes` seed data is removed. Any DB state that references it (via `character_race_attribute_values`) will be invalidated. Confirmed acceptable — existing character description data is empty.
- **Two extra race lookups on race change** → `updateCharacterForOwner` now fetches both old and new race rows to compare types. These are small indexed PK lookups; the overhead is negligible.

## Migration Plan

1. Drop `character_race_attribute_values`, `race_attributes`, `class_attributes`, `theme_attributes`
2. Create `race_type` enum
3. Add `type race_type NOT NULL` to `races` (with migration data: all non-android races → `'humanoid'`, Android → `'android'`)
4. Create `race_descriptions` table
5. Create `character_descriptions` table
6. Seed `race_descriptions` with humanoid and android field sets

No rollback is required — this is a development environment with no production data to preserve.
