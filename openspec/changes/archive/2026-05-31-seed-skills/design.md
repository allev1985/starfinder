## Context

The app already has seeded reference tables for `classes` (7 CRB classes with stable hardcoded UUIDs in the `b1000000-...` range) and `races`. Skills are the next reference dataset needed before the character sheet can display skill ranks. There is currently no `skills` table in the schema.

## Goals / Non-Goals

**Goals:**
- Define `skills` and `class_skills` tables in the Drizzle schema
- Seed all 20 CRB skills with their static properties
- Seed all class-skill relationships for the 7 CRB classes via the join table

**Non-Goals:**
- Per-character skill ranks — that's a future `character_skills` table
- Non-CRB classes (Biohacker, Vanguard, Witchwarper, etc.)
- Profession sub-skills — Profession is seeded as a single skill; per-character profession specialisation is out of scope

## Decisions

**Join table over array column on `skills`**
An earlier option was storing class UUIDs as a `uuid[]` array on the `skills` table. Rejected because `classes` is a proper relational entity with FK constraints — a join table is correct 1NF and keeps FK integrity. Adding new classes later is just new rows, no schema change.

**Profession ability = WIS**
The CRB says Profession uses any one ability score relevant to the profession. We store `WIS` as the default (most common) and will handle per-character ability override in the future `character_skills` table if needed.

**Hardcoded UUIDs in the `d1000000-...` range**
Consistent with the existing pattern (`b1` for classes, `c1` for themes). Skills will use `d1000000-0000-0000-0000-0000000000XX`. This makes the seed SQL readable and debuggable.

**Single migration file for DDL + seed**
Consistent with project convention (e.g., `0010_reseed_race_attributes.sql` combines both). DDL runs first, then INSERTs.

## Risks / Trade-offs

[Profession ability score] Using WIS as default may be wrong for some professions. Mitigation: document the decision; the `character_skills` table can carry an override when built.

[Class skills completeness] The CRB class skill lists are transcribed from memory/knowledge. Mitigation: cross-check against the class skill table in the Starfinder CRB before applying the migration.

## Migration Plan

1. Add `skills` and `class_skills` to `src/db/schema.ts`
2. Write `supabase/migrations/0019_skills_seed.sql` — DDL + all INSERT statements
3. Apply via Supabase MCP or SQL editor
4. No rollback risk: additive tables with no FKs from existing character data
