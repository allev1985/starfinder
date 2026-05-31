## Why

The current drone skill implementation incorrectly seeds all 6 allowed skills at creation and assigns ranks to every one of them. In Starfinder 1e, a drone only has ranked skills it has been explicitly given — one chosen Skill Unit at creation, optionally one chassis bonus skill, and any additional skills gained through Advanced Skill Mods. All other allowed skills are simply unavailable until a mod grants them.

## What Changes

- **New**: Skill Unit selection required during drone character creation (one skill chosen from the drone allowed list)
- **Modified**: Drone creation seeds only the chosen Skill Unit + chassis bonus skill (not all 6)
- **Modified**: Drone skills section re-enables an "Add Skill" control, but restricted to the drone allowed list, so owners can add mod-granted skills post-creation
- **Removed**: Seeding of all 6 drone skills at creation
- **Modified**: Existing drone characters with incorrectly seeded skills need a data cleanup (delete excess skills, keep chassis bonus + any the owner explicitly wants to retain via the new add control)

## Capabilities

### New Capabilities

- `drone-skill-unit`: Skill Unit selection at drone creation; restricted add-skill control for mod-granted skills

### Modified Capabilities

- `android-skills`: Drone creation seeds only Skill Unit + chassis bonus; add-skill re-enabled for drones but filtered to drone allowed list
- `android-chassis`: Chassis creation step now also prompts for Skill Unit selection

## Impact

- `src/app/dashboard/characters/new/_new-form.tsx` — Skill Unit selector shown when drone race selected (after chassis, filtered to drone skill list minus chassis bonus)
- `src/app/dashboard/characters/new/actions.ts` — pass `skillUnitSkillId` to service
- `src/services/characters.ts` — `createCharacterForUser` seeds only skill unit + chassis bonus
- `src/db/queries/characters.ts` — `createCharacter` updated seeding logic; new query to get drone skill list for add dialog
- `src/app/dashboard/characters/[id]/_components/skills-section.tsx` — drone add-skill button re-enabled, opens dialog filtered to drone allowed list
- `src/app/dashboard/characters/[id]/_components/add-skills-dialog.tsx` — accept optional skill filter list
- Data migration to clean up existing drone characters with excess skills
