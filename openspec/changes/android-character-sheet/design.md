## Context

The character sheet currently treats all characters identically. The `race_type` enum already has `android` seeded for the Android race entry, and `CharacterWithMeta` already carries `raceType` to the client. The `characterCombatStats` table stores SP/HP/RP for every character. The `characterSkills` table stores open-list skills with manually assigned ranks.

Android characters (Mechanic's companions) diverge in three areas: health pools (HP only), skills (fixed list, auto-ranked), and a required link to a mechanic character. None of these branching behaviors exist yet.

## Goals / Non-Goals

**Goals:**
- Add `chassis` reference table and seed Combat/Hover/Stealth chassis with default ability scores and bonus skills
- Add `chassisId` and `mechanicCharacterId` columns to `characters`
- Branch the character creation form to require chassis selection for android races
- Branch health section to show HP-only for androids
- Branch skills section to show a locked 6-skill list with mechanic-derived ranks for androids
- Add a Mechanic panel to the android character sheet
- Hide CON from the ability scores section for androids

**Non-Goals:**
- Modeling the Upgraded Power Core mod (optional RP for androids at level 10)
- Drone chassis beyond the 3 CRB options
- Automated rank sync when mechanic levels up (ranks are displayed at query time, not stored)
- Enforcing that the linked mechanic character actually has the Mechanic class

## Decisions

### Decision: `chassis` as a seeded reference table, not an enum

**Chosen**: `pgTable("chassis", ...)` seeded via migration.

**Rationale**: Chassis carries structured data (bonus skill FK, 5 default ability scores). An enum would push all that data into application code. Consistent with how races, classes, and themes are handled.

**Alternative considered**: `androidChassis` pgEnum + hardcoded defaults in app code. Rejected because ability score defaults and bonus skill resolution would have to live in two places (seed migration + application constants), creating drift risk.

### Decision: `ranks` not stored for android skills — derived at query time

**Chosen**: Android `characterSkills` rows always have `ranks = 0`. The display layer computes `displayRanks = mechanicCharacter.level` when `raceType === 'android'`.

**Rationale**: Storing ranks for androids would require a sync trigger every time the mechanic levels up. Derived-at-query is simpler, always correct, and avoids stale data.

**Alternative considered**: Storing and syncing. Rejected due to cascade complexity and drift risk.

### Decision: `mechanicCharacterId` as self-referential FK on `characters`

**Chosen**: `characters.mechanic_character_id UUID? → characters.id`

**Rationale**: The android-to-mechanic relationship is 1:1 from the android's side. A self-referential FK is the minimal correct model. No join table needed.

**Alternative considered**: Separate `android_mechanic_links` table. Rejected — one-to-one relationships don't benefit from a join table and the indirection adds query complexity for no gain.

### Decision: No enforcement that linked mechanic has Mechanic class

The FK points to any character. We soft-filter the mechanic picker UI to show Mechanic-class characters first, but the constraint is not enforced at the DB level.

**Rationale**: DB-level enforcement would require a check constraint or trigger across two tables. The user confirmed this is a quality-of-life filter, not a hard rule for the app.

### Decision: CON score stored as 10 for androids, hidden in UI

Androids have no CON score but are treated as CON 10 by the rules. The `conScore` column stays `notNull default 10` — no schema change. The ability scores section conditionally hides the CON row when `raceType === 'android'`.

**Rationale**: Making `conScore` nullable would require a migration and null-checks throughout existing query code for a purely presentational concern.

## Risks / Trade-offs

- **Mechanic level drift at display time** → The android sheet fetches the mechanic character's current level on every page load, so rank display is always up to date. No sync needed.

- **No mechanic linked yet** → Rank display shows `—` and the Mechanic panel shows an empty link prompt. The sheet is still usable; HP and misc mods are independent of the mechanic link.

- **Combat chassis bonus skill** → Starfinder 1e SRD is ambiguous on whether Combat chassis has a bonus skill. `chassis.bonus_skill_id` is nullable; Combat chassis seeds with `null`. If a future source clarifies, a single migration row update suffices.

- **Android race creation — chassis required** → If a user selects the Android race without choosing a chassis, the form blocks submission. This is intentional but requires clear UI feedback.

## Migration Plan

1. Add `chassis` table migration (schema + seed: 3 rows)
2. Add `characters.chassis_id` and `characters.mechanic_character_id` migrations (nullable, no backfill needed)
3. Deploy — no existing character data is affected (both columns nullable)
4. Rollback: drop the two columns and the chassis table; no data loss on characters

## Open Questions

- Confirmed: Combat chassis has no bonus skill (`bonusSkillId = null`)
- Confirmed: mechanic link is optional at creation, set after
- Confirmed: ranks are derived, not stored
