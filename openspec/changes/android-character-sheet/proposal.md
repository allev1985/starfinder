## Why

Android characters (the Mechanic's companion) follow fundamentally different rules from biological characters: they have HP only (no Stamina or Resolve), a fixed skill list with ranks derived from the linked mechanic's level rather than a spend pool, and their base ability scores are determined by chassis type. The current character sheet treats all characters identically, making it unusable for androids.

## What Changes

- **New**: `chassis` reference table (Combat, Hover, Stealth) with default ability scores and optional bonus skill
- **New**: `chassisId` FK on `characters` — required for androids, null for biological
- **New**: `mechanicCharacterId` self-referential FK on `characters` — links an android to its mechanic
- **Modified**: Character creation flow branches on race type — android creation requires chassis selection and seeds only the 6 android skills
- **Modified**: Health & Resolve section hides Stamina and Resolve rows for androids
- **Modified**: Skills section renders a locked 6-skill list with read-only ranks (= mechanic level) for androids; no add/remove controls
- **New**: Mechanic panel on android character sheet displaying linked mechanic name, level, and INT modifier
- **Modified**: Ability scores section hides CON for androids (treated as 10 by rules, not displayed)

## Capabilities

### New Capabilities

- `android-chassis`: Chassis reference data (Combat/Hover/Stealth) with default ability scores and bonus skill; chassis selection during android character creation
- `android-mechanic-link`: Linking an android to its mechanic character; displaying mechanic name, level, and INT modifier on the android sheet
- `android-skills`: Fixed 6-skill list for androids with ranks derived from mechanic level; no rank spend pool; misc mod still editable

### Modified Capabilities

- `character-health-resolve`: Android characters show only Hit Points; Stamina and Resolve rows hidden
- `character-skills`: Android characters use a locked skill list — no add/remove dialog; ranks column is read-only and derived
- `crb-reference-data`: Add `chassis` table to reference data seeding
- `db-schema`: Add `chassis` table, `chassisId` and `mechanicCharacterId` columns to `characters`

## Impact

- `src/db/schema.ts` — new `chassis` table and two new columns on `characters`
- `src/db/queries/characters.ts` — `createCharacter` branches on race type for skill seeding; new queries for mechanic lookup and mechanic-link update
- `src/app/dashboard/characters/new/` — chassis selector shown when android race selected
- `src/app/dashboard/characters/[id]/_components/health-resolve-section.tsx` — conditional row rendering
- `src/app/dashboard/characters/[id]/_components/skills-section.tsx` — android mode: locked list, read-only ranks
- `src/app/dashboard/characters/[id]/_components/ability-scores-section.tsx` — hide CON row for androids
- New migration required for chassis table and character column additions
- Chassis seeding script/migration required
