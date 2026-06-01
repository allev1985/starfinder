## Context

The app currently has no spell support. Two of the seven CRB classes (Mystic and Technomancer) are full spellcasters — without spells, their character sheets are functionally incomplete. The existing reference-data pattern (enum + reference table + seed migration) is well-established for weapons, armor, and equipment; spells follow the same approach.

Spell slot tracking in Starfinder 1e: both Mystic and Technomancer are "spells known" casters — they memorize a fixed list and can cast any known spell using an available slot. There are no per-day preparation decisions. Slots are manually tracked (not auto-calculated) because the UI is simpler and the user retains full control.

## Goals / Non-Goals

**Goals:**
- Seed all CRB Mystic and Technomancer spells (levels 0–6, ~70 unique spells)
- Provide `spell_class` junction so each spell knows which classes can cast it and at what level
- Add `is_spellcaster` to `classes` so the UI can conditionally render the Spells section
- Character can learn spells from their class's spell list
- Character can manually track spell slots (total + used) per spell level

**Non-Goals:**
- Spell progression reference table (`class_spell_progression`) — deferred; slots are user-managed
- Non-CRB spells (Pact Worlds, etc.)
- Solarian stellar revelations (not spells)
- Spell preparation mechanics (neither CRB caster uses prepared casting)
- Spell component tracking (verbal/somatic/material — not mechanically significant in Starfinder)

## Decisions

### D1: `spell_school` as a Postgres enum

**Decision**: Use `pgEnum('spell_school', [...])` in `src/db/schema.ts`.

**Rationale**: The 9 schools (8 + universal) are a closed, stable set defined by the rules. Consistent with `race_type`, `armor_type`, and `equipment_category` already in the schema.

**Alternative considered**: `text` with a check constraint — rejected because the enum gives TypeScript type safety via Drizzle inference at no extra cost.

### D2: Damage stored as text + optional damage_note

**Decision**: `damage text` (nullable) for the primary damage expression (e.g., `"4d6 E"`) and `damage_note text` (nullable) for caster-level scaling exceptions.

**Rationale**: In Starfinder 1e, spells at a given level deal fixed damage — scaling is baked into the spell level design, not a slot-upcast mechanic like PF2e. Structured damage fields would add complexity with no query-time benefit; the values are display-only.

**Alternative considered**: JSONB damage object — overkill for display-only data with no arithmetic operations needed.

### D3: No `class_spell_progression` table

**Decision**: Omit the class-level progression reference table entirely.

**Rationale**: Spell slots are manually adjusted by the user, so the app never computes slots from a reference table. The "spells known" count is also informational — the user manages their own spell list. This can be added later if a "reference hints" feature is desired.

### D4: `character_spell_slots` covers levels 1–6 only

**Decision**: Level 0 spells are at-will with no slot tracking; `character_spell_slots` only stores rows for spell levels 1–6.

**Rationale**: Starfinder cantrips (level 0) have no per-day limit. Storing a slot row for level 0 would be meaningless.

### D5: `is_spellcaster` flag on `classes`

**Decision**: Add `is_spellcaster boolean NOT NULL DEFAULT false` to the `classes` table; set `true` for Mystic and Technomancer via migration.

**Rationale**: Clean boolean gate for the UI — no implicit coupling to spell data existing for a class. More readable than checking `spell_class` rows at render time.

### D6: Spell section hidden for non-spellcasters

**Decision**: The Spells section component is not rendered at all when `character.class.is_spellcaster = false`.

**Rationale**: Non-spellcasting classes (Envoy, Mechanic, Operative, Solarian, Soldier) have no spells — showing an empty or disabled section adds visual noise without value.

## Risks / Trade-offs

**Seeding accuracy** → The CRB spell descriptions are extensive; errors in damage values, ranges, or descriptions are likely in a manual seed. Mitigation: source from Archives of Nethys (aonprd.com) which mirrors CRB data; mark source column as `'CRB'` for traceability.

**Spell count** → ~70 spells across two classes means a substantial seed migration. Mitigation: split into separate migration files per class (Mystic spells, Technomancer spells, shared spells) to keep files manageable.

**Manual slot tracking UX** → Users must look up their own progression table and enter total slots manually. This is acceptable for now but may feel tedious at character creation. Mitigation: deferred `class_spell_progression` table can provide auto-fill hints in a future iteration.

## Migration Plan

1. Schema migration: `spell_school` enum, `spells` table, `spell_class` table, `character_spells` table, `character_spell_slots` table, `is_spellcaster` on `classes`
2. Data migration: backfill `is_spellcaster = true` for Mystic and Technomancer rows
3. Seed migration A: shared spells (appear on both class lists)
4. Seed migration B: Mystic-only spells + `spell_class` rows for Mystic
5. Seed migration C: Technomancer-only spells + `spell_class` rows for Technomancer
6. Seed migration D: `spell_class` rows for shared spells (both classes)

Rollback: drop the new tables and enum; remove `is_spellcaster` column. No existing data is affected.
