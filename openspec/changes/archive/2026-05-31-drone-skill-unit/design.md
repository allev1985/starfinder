## Context

Drone characters currently have all 6 allowed skills seeded at creation with ranks derived from mechanic level. Starfinder 1e specifies that a drone only has skills it has been explicitly granted: one Skill Unit chosen at creation, one chassis bonus skill (chassis-dependent), and any additional skills from Advanced Skill Mods taken later. The `characterSkills` table and rank-derivation logic are otherwise correct — only the seeding scope is wrong.

The allowed drone skill list is: Acrobatics, Athletics, Computers, Perception, Stealth, Survival.

## Goals / Non-Goals

**Goals:**
- Skill Unit selected at drone creation; only that skill + chassis bonus seeded
- Post-creation, owner can add skills from the drone allowed list (mod grants)
- Clean up existing drone characters that have excess skills

**Non-Goals:**
- Enforcing that add-skill is only used at levels where mods are available (trust the player)
- Tracking which specific mod granted each skill

## Decisions

### Decision: Skill Unit selector in creation form, not a separate DB column

The Skill Unit selection is a one-time creation choice that determines which skill gets seeded. It does not need its own column — the result is just a `characterSkills` row. We pass `skillUnitSkillId` through the action/service and seed it like the chassis bonus skill.

**Alternative considered**: storing `skillUnitSkillId` on the `characters` table. Rejected — the seeded row is the canonical record; a separate column would be redundant.

### Decision: Re-enable add-skill for drones, filtered to drone allowed list

The add-skills dialog currently receives `allSkills`. For drones we pass a filtered subset matching the drone allowed list. Skills already on the drone's sheet are pre-checked (and cannot be added again). This reuses the existing dialog with minimal change.

**Alternative considered**: A separate drone-specific dialog. Rejected — the existing dialog handles filtering cleanly via props.

### Decision: Data migration strips excess skills from existing drones

Existing drone characters were seeded with all 6 skills. The migration deletes `characterSkills` rows for drone characters where the skill is not the chassis bonus skill AND not in a whitelist the owner confirmed. Since this is a dev environment we simply delete all drone character skills and leave re-seeding to the owner via the new add-skill control.

## Risks / Trade-offs

- **Existing drone characters lose all skills** after the cleanup migration. Owners will need to re-add their Skill Unit via the add-skill control. Acceptable in dev; for production a more surgical migration would be warranted.
- **No enforcement of the 1-skill-unit limit** after creation — the add-skill control lets owners add freely. This is intentional (trust the player for mod grants).

## Migration Plan

1. Migration: delete all `character_skills` rows for drone characters (clean slate)
2. Deploy new creation form with Skill Unit selector
3. Rollback: no schema changes, so rollback is just reverting code
