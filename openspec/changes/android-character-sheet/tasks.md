## 1. Schema — chassis table

- [x] 1.1 Add `chassis` table to `src/db/schema.ts` with columns: `id`, `name`, `bonusSkillId` (nullable FK → skills), `defaultStr`, `defaultDex`, `defaultInt`, `defaultWis`, `defaultCha`
- [x] 1.2 Export `Chassis` and `NewChassis` inferred types from `src/db/schema.ts`
- [x] 1.3 Run `npm run db:generate` and verify the migration file is created for the chassis table

## 2. Schema — characters table additions

- [x] 2.1 Add nullable `chassisId` UUID FK column (→ `chassis.id`) to the `characters` table in `src/db/schema.ts`
- [x] 2.2 Add nullable `mechanicCharacterId` UUID self-referential FK column (→ `characters.id`) to the `characters` table in `src/db/schema.ts`
- [x] 2.3 Run `npm run db:generate` and verify the migration file adds both columns

## 3. Seed chassis reference data

- [x] 3.1 Write a seeding migration that inserts the 3 chassis rows (Combat, Hover, Stealth) with correct default ability scores and `bonusSkillId` values (Hover → Acrobatics, Stealth → Stealth, Combat → null)
- [x] 3.2 Apply migration and verify chassis rows are present with correct data

## 4. Queries — chassis and mechanic link

- [x] 4.1 Add `getChassisById(id)` query to `src/db/queries/reference.ts`
- [x] 4.2 Add `getAllChassis()` query to `src/db/queries/reference.ts`
- [x] 4.3 Update `CharacterWithMeta` type and `getCharacterWithCampaigns` query to include `chassisId`, `chassisName`, `mechanicCharacterId`, mechanic's `name`, `level`, and `intScore`
- [x] 4.4 Add `updateMechanicLink(characterId, mechanicCharacterId | null)` mutation to `src/db/queries/characters.ts`
- [x] 4.5 Add `getCharactersForMechanicPicker(characterId)` query — returns characters sharing a campaign with the android, ordered Mechanic-class first

## 5. Queries — android skill seeding

- [x] 5.1 Update `createCharacter()` in `src/db/queries/characters.ts` to branch on race type: biological characters seed no skills (existing behavior); android characters seed only the 6 android skills plus chassis bonus skill, all with `ranks = 0`
- [x] 5.2 Verify deduplication: if chassis bonus skill is already in the standard 6 (e.g., Hover → Acrobatics, Stealth → Stealth), insert only one row for that skill

## 6. Character creation form — chassis selector

- [x] 6.1 Fetch chassis list in the new character form server component and pass to the client form
- [x] 6.2 In `src/app/dashboard/characters/new/_new-form.tsx`, show the chassis selector only when the selected race has `type = 'android'`
- [x] 6.3 Apply chassis default ability scores when the form is submitted for an android character
- [x] 6.4 Validate chassis is required when race is android; show inline error if missing

## 7. Health section — android branching

- [x] 7.1 Pass `raceType` into `HealthResolveSection` (it may already flow through `character-stats-client.tsx` — verify)
- [x] 7.2 Update `health-resolve-section.tsx` to render only the HP row when `raceType === 'android'`
- [x] 7.3 Update section heading to "Hit Points" for androids and retain "Health & Resolve" for biological
- [x] 7.4 Ensure the debounced save action only sends HP fields for androids

## 8. Ability scores section — hide CON for androids

- [x] 8.1 Pass `raceType` into `ability-scores-section.tsx`
- [x] 8.2 Conditionally hide the CON row when `raceType === 'android'`

## 9. Skills section — android mode

- [x] 9.1 Pass `raceType` and `mechanicLevel` (from linked mechanic or null) into `skills-section.tsx`
- [x] 9.2 When `raceType === 'android'`: hide the "Add Skills" button
- [x] 9.3 When `raceType === 'android'`: remove per-row delete controls
- [x] 9.4 When `raceType === 'android'`: render ranks as read-only text (mechanic level, or "—" if none linked)
- [x] 9.5 When `raceType === 'android'`: hide the ranks budget indicator
- [x] 9.6 Update skill total computation for android: use `mechanicLevel` instead of `ranks` in the formula

## 10. Mechanic panel

- [x] 10.1 Create `mechanic-panel.tsx` server/client component that renders the linked mechanic's name, level, and INT modifier
- [x] 10.2 Build the mechanic picker select (owner-only) with `getCharactersForMechanicPicker` data, Mechanic-class characters listed first
- [x] 10.3 Wire the picker onChange to call `updateMechanicLink` server action with debounced save
- [x] 10.4 Show "No mechanic linked" empty state when `mechanicCharacterId` is null
- [x] 10.5 Add `mechanic-panel.tsx` to the android character detail page layout (hidden for biological characters)

## 11. Lint and typecheck

- [x] 11.1 Run `npm run lint` and fix any errors
- [x] 11.2 Run `npx tsc --noEmit` and fix any type errors
