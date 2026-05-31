## Context

The character sheet currently has an Armor section within the combat block. Armor is a single-equip reference (one FK on `characters`). Weapons are fundamentally different: a character carries many, so they require a join table. The weapons reference table must be seeded from the CRB — ~180 entries across 8 categories. During the build-out phase, weapon inventory is display-only; no attack roll calculations are derived from it.

## Goals / Non-Goals

**Goals:**
- `weapons` reference table with structured, roller-ready fields (split dice from damage type; split critical effect from critical dice)
- `character_weapons` join table (many weapons per character)
- Searchable weapon picker (combobox, same pattern as armor)
- Stat card per weapon showing all fields
- Inventory section on the character sheet housing both Armor and Weapons
- CRB weapons seeded via SQL migrations

**Non-Goals:**
- Attack roll calculation or display — gameplay phase only
- Ammo tracking (current ammo per character) — gameplay phase only
- Weapon fusions or upgrades
- Non-CRB weapon sources

## Decisions

### D1: Split damage and critical into component fields

Store `damageDice` (e.g., `"1d6"`), `damageTypes` (`text[]`, e.g., `["Fire"]`), `criticalEffect` (`text`, e.g., `"Burn"`), and `criticalDice` (`text`, e.g., `"1d4"`) as separate columns rather than a single free-text string like `"1d6 Fire"`.

**Why**: A future dice roller needs parseable fields. Splitting now costs nothing at seed time and avoids string parsing later. Alternative (single text field) is simpler to seed but forces a parsing step when rolling is built.

### D2: `character_weapons` as a pure join table (no extra columns now)

No `currentAmmo` or `customLabel` columns yet — those belong to the gameplay phase.

**Why**: Keeps the schema minimal. Ammo tracking requires a "current vs capacity" UI pattern that is explicitly out of scope. Adding unused columns now creates dead schema.

### D3: `weaponCategory` as a Postgres enum

Categories: `small_arms`, `longarms`, `heavy`, `sniper`, `melee_basic`, `melee_advanced`, `grenade`, `special`.

**Why**: Consistent with how `armorType` is handled. Enum enforces valid values at the DB level. A future proficiency check or filter will query by category — enum makes that indexable and safe.

### D4: Seed via SQL migrations, one file per category

Follow the existing armor seed pattern (`20260531200000_seed_armor_light.sql`, etc.). One migration per weapon category.

**Why**: Consistent with existing conventions. Keeps individual files manageable (~20–40 rows each). Easy to review and rollback per category.

### D5: Inventory section relocates armor picker

Armor picker moves from the combat section into the new Inventory section. The combat section retains its derived stats (EAC, KAC, saves) but no longer contains the picker UI.

**Why**: Armor and weapons logically belong together as "what the character carries." Grouping them in Inventory is cleaner than having armor in combat and weapons elsewhere.

### D6: Weapon display as stat cards

Each carried weapon renders as a card (matching the armor card style) showing all fields. No collapsed/expanded toggle — all stats visible at once.

**Why**: User explicitly requested stat cards. With a typical loadout of 2–4 weapons, the vertical space is acceptable. A compact list would be appropriate if characters regularly carried 8+ weapons, which is uncommon in Starfinder.

## Risks / Trade-offs

- **Seed data accuracy** — CRB weapon stats must be manually verified. Stats sourced from Archives of Nethys (aonprd.com), same approach as armor seeds. [Risk: transcription errors] → Mitigation: each migration includes a comment citing the source; errors can be corrected in a follow-up migration.
- **`damageTypes` as `text[]`** — Postgres array columns work well but are less ergonomic in some ORM queries. Drizzle supports them via `.array()`. [Risk: ORM friction] → Mitigation: existing schema already uses `text().array()` (see `skills.abilityAlts`), so the pattern is established.
- **~180 seed rows** — Large seed migrations are slow to write but straightforward to apply. [Risk: missing weapons] → Mitigation: scope explicitly to CRB only; additional sources added later.

## Migration Plan

1. Schema migration: add `weaponCategory` enum, `weapons` table, `character_weapons` table
2. Seed migrations (8 files, one per category)
3. Application code changes (queries, actions, components)
4. No rollback complexity — new tables only; no existing data modified
