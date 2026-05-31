## Context

The character sheet already supports armor and weapons as reference + instance table pairs. Equipment (augmentations, personal upgrades, ammunition) follows the same pattern but introduces two new concerns: (1) items that carry mechanical bonuses the player must manually apply, and (2) items that have quantity (ammunition). The weapons table also needs backfilling with `ammo_type` so the UI can surface "what ammo does this weapon use."

## Goals / Non-Goals

**Goals:**
- Seed all CRB augmentations (cybernetic + biotech), personal upgrades Mk 1–3, and all CRB ammunition types as reference data
- Add `character_equipment` instance table with quantity support
- Add `ammo_type` to the `weapons` table and backfill all seeded weapons
- Display a bonus hint callout on equipment cards where `bonus_hint` is set — owner applies the modifier manually
- Add an Equipment subsection to the Inventory section grouped as Augmentations/Upgrades and Ammunition

**Non-Goals:**
- Automatic stat derivation from equipped items — all bonuses are manual
- Augmentation slot enforcement at the DB level — display only
- General adventuring gear, magic items, hybrid items, computers, vehicles
- Current-charges tracking per weapon (ammo quantity in inventory is tracked, not per-weapon load state)

## Decisions

### Enums for category and system

Use Postgres enums (`equipment_category`, `augmentation_system`) rather than free text, consistent with `armor_type` and `weapon_category`. This gives DB-level constraint enforcement and makes the Drizzle types narrow.

**Alternatives considered:** text columns with application-level validation — rejected for inconsistency with established schema patterns.

### `bonus_hint` as free text

Equipment bonuses in Starfinder are diverse (skill bonuses, ability score changes, senses, resistances). Modeling each bonus type structurally would require a complex polymorphic design for little gain — the player reads the book anyway. A single nullable `bonus_hint` text field stores a human-readable instruction (e.g., "Apply +2 to STR score (Ability Scores section)"). Items without a bonus have `null`; the UI shows no callout.

**Alternatives considered:** structured bonus fields (`bonus_type`, `bonus_value`, `bonus_target`) — rejected as premature modeling that adds schema complexity without enabling automatic application.

### `ammo_type` on weapons as nullable text

`weapons.ammo_type` is a nullable text column whose values match the equipment seed's ammo type identifiers (e.g., `'battery'`, `'small_arm_rounds'`). No FK — the equipment table has a matching column but the link is by convention, not constraint.

**Alternatives considered:** FK to an `ammo_types` lookup table — rejected as over-engineering for what is essentially a display label + filter key.

### Quantity on `character_equipment`

Unlike weapons and armor (one instance per pickup), ammunition is bought and consumed in quantity. `character_equipment.quantity` defaults to 1 and is editable for ammo items. Augmentations and upgrades are always quantity 1 in practice, but the column is general.

### Seed strategy: SQL migrations per category

Consistent with weapons and armor: one migration file per category (`seed_equipment_augmentations_cybernetic.sql`, `seed_equipment_augmentations_biotech.sql`, `seed_equipment_personal_upgrades.sql`, `seed_equipment_ammunition.sql`). Fixed UUIDs for idempotency.

### No slot enforcement in DB

Augmentation slot limits (one per body system) are Starfinder rules the player enforces at the table. Adding a unique constraint on `(character_id, system)` for augmentations would block valid scenarios (e.g., two different eye augments occupying one slot each) and adds complexity for a character-sheet tool where players are trusted to follow rules.

## Risks / Trade-offs

- **Bonus hint accuracy** → Migrates must include accurate `bonus_hint` text sourced from CRB. Wrong hints mislead players. Mitigation: source from Archives of Nethys, keep wording simple and action-oriented.
- **ammo_type backfill correctness** → Each of the ~100 seeded weapons must get the correct `ammo_type`. Errors here cause wrong "Uses:" labels on weapon cards. Mitigation: review each seed file category by category; melee and grenades get `null`.
- **quantity UX for augmentations** → Showing a quantity field for an augmentation (which is always 1) is odd. Mitigation: hide the quantity control in the UI for non-ammunition categories; quantity is still stored but defaults to 1 and is not editable.
