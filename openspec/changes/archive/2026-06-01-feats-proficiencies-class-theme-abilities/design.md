## Context

The character sheet currently stores class and theme as foreign key references but renders nothing about the abilities those choices confer. Adding class features, theme features, feats, and weapon proficiencies introduces:

- New reference tables (seeded from CRB, read-only to the app)
- New per-character tables for player choices and feat selections
- New character sheet sections that read from both layers

Existing patterns to follow: armor reference + `class_armor_proficiency` (reference data), spells + `character_spells` (reference + character junction), the debounced-save hook for any editable fields.

## Goals / Non-Goals

**Goals:**
- Display all CRB class features a character has earned at/below their current level
- Display all CRB theme features a character has earned at/below their current level
- Allow a character to record and view their feats (reference-linked or custom freetext)
- Display weapon proficiencies derived from class (read-only, no character data needed)
- Record what a player chose for choice-based and repeatable class feature slots

**Non-Goals:**
- Auto-applying feat or feature bonuses to ability scores, saves, or attack rolls (all adjustments remain manual)
- Prerequisites validation for feats (shown as informational text only)
- Content beyond CRB (no AP classes, additional feats, or alternate class features in scope)
- Sub-options for class feature choices beyond CRB (e.g., no AP fighting styles)

## Decisions

### 1. Repeatable features use a `repeatable` flag rather than duplicated rows

**Decision**: `class_abilities` has a boolean `repeatable` column. When `true`, the UI derives the slot count from how many times that feature appears in the progression up to the character's current level rather than storing N identical rows.

**Rationale**: Envoy gains Improvisation at almost every level (1–20). Storing 18 identical rows with only `level` differing is brittle — changing the description means 18 updates. A single row + level-derived count is DRY and easier to seed.

**Alternative considered**: Multiple rows with the same `name` and different `level` values. Rejected because it creates update anomalies and complicates seeding scripts.

### 2. Choice features use `choice_pool` text + a separate `class_ability_options` table

**Decision**: When a class feature requires a player selection (e.g., Fighting Style, Connection, Improvisation), `class_abilities.choice_pool` is set to a pool identifier (e.g., `"fighting_style"`, `"improvisation"`). `class_ability_options` rows reference `class_id` and `pool_name` to enumerate the valid options.

**Rationale**: Decouples the "slot" (when you get to choose) from the "options" (what you can choose). The character's selection is stored in `character_class_choices.option_id` with a `custom_value` freetext fallback for edge cases.

**Alternative considered**: Storing sub-options as child rows on `class_abilities` via `parent_ability_id`. Rejected because querying "all options for this pool" becomes awkward when the same pool appears at multiple levels.

### 3. Feats use a hybrid reference + freetext model

**Decision**: `character_feats` has a nullable `feat_id` FK and a nullable `custom_name` text column. Exactly one of the two SHALL be non-null per row. The UI presents a searchable picker over `feats` reference data first; an "Add custom feat" option falls through to freetext entry.

**Rationale**: The CRB has ~100 feats, but characters can acquire racial feats, AP-specific feats, and class bonus feats that may not be in the reference table. Freetext ensures the sheet is still usable even when reference data is incomplete.

**Alternative considered**: Reference-only (reject feats not in DB). Rejected because it makes the sheet unusable for any non-CRB feat.

### 4. Class features and theme features are derived server-side — no character table needed for display

**Decision**: `ClassFeaturesSection` and `ThemeFeaturesSection` receive the full ability list for the character's class/theme from the server; filtering to ≤ current level happens in the query (or the component). No character-side table is needed just to *display* them.

**Rationale**: A character's class features at level N are fully determined by `class_id` + `level` — there is no per-character variation in which features they have (only in what they *chose* for choice slots, which is `character_class_choices`).

### 5. Seeding via SQL migration files, not application seed scripts

**Decision**: CRB reference data (class abilities, theme abilities, feats, weapon proficiencies) is seeded in numbered Supabase migration files alongside the schema migrations.

**Rationale**: Consistent with the existing pattern for weapons, armor, spells, and skills. Migration files are idempotent, version-controlled, and run automatically in CI and on branch resets.

### 6. `character_class_choices` links choice slot to level acquired

**Decision**: `character_class_choices` stores `class_ability_id`, `option_id` (nullable FK to `class_ability_options`), `custom_value` (nullable text), and `acquired_at_level` integer. For repeatable features, `acquired_at_level` distinguishes which slot a given choice fills.

**Rationale**: An Envoy at level 10 has 10 improvisation slots. Without `acquired_at_level`, there is no way to identify which slot a choice belongs to or detect if a slot is unfilled.

## Risks / Trade-offs

- **Seeding effort** → ~500 rows across five new tables; mitigated by writing focused seed migrations per domain (class abilities, theme abilities, feats, weapon proficiencies) rather than one monolithic file
- **CRB description accuracy** → Full descriptions are transcribed manually; errors are possible. Mitigation: treat description text as a convenience reference, not a rules arbiter
- **Repeatable slot count drift** → If `class_abilities.level` seed data has an error, the UI shows the wrong number of slots for repeatable features. Mitigation: seed data is in version-controlled migrations and can be corrected with a follow-up migration
- **Choice feature UX complexity** → Showing N pickers for N improvisation slots is potentially noisy for high-level Envoys. Mitigation: collapse unfilled slots into a single "+ Choose improvisation" prompt in v1; expand per-slot pickers as a follow-up

## Migration Plan

1. Add schema tables (new migration): `class_abilities`, `class_ability_options`, `theme_abilities`, `feats`, `class_weapon_proficiency`, `character_class_choices`, `character_feats`
2. Seed weapon proficiencies (new migration — depends on `classes` being seeded)
3. Seed class abilities + options per class (one migration per class or one combined)
4. Seed theme abilities (new migration)
5. Seed feats (new migration)
6. Deploy UI changes (no rollback needed; new sections are additive)

Rollback: drop the new tables and remove the UI sections. No existing tables are modified.
