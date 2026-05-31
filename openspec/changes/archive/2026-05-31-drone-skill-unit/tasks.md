## 1. Data cleanup migration

- [x] 1.1 Write a migration that deletes all `character_skills` rows for drone characters (clean slate for re-seeding via the new add-skill control)
- [x] 1.2 Apply migration and verify drone characters have no `character_skills` rows

## 2. Creation form — Skill Unit selector

- [x] 2.1 In `_new-form.tsx`, fetch or derive the drone allowed skill list from `allSkills` passed as a prop (or fetch separately in the page); for now pass `allSkills` filtered by name to the form
- [x] 2.2 Add Skill Unit selector below chassis selector — shown only when drone race selected; options = drone allowed list minus the chassis bonus skill for the selected chassis
- [x] 2.3 When chassis changes, reset Skill Unit selection if the current value conflicts with the new chassis bonus
- [x] 2.4 Update page server component to fetch drone skill list and pass to form

## 3. Creation action and service

- [x] 3.1 Extract `skillUnitSkillId` from `formData` in `createCharacterAction`; validate it is present for drone characters
- [x] 3.2 Pass `skillUnitSkillId` through to `createCharacterForUser` in the service
- [x] 3.3 Update `createCharacter` in `characters.ts`: seed only `skillUnitSkillId` + chassis bonus skill (no more full drone skill list seeding)

## 4. Add-skill dialog — drone filter

- [x] 4.1 Add optional `allowedSkillIds` prop to `AddSkillsDialog`; when provided, filter the displayed skill list to only those IDs
- [x] 4.2 In `SkillsSection`, when `raceType === 'drone'`, show the "Add Skill" button and pass the drone allowed skill IDs as `allowedSkillIds` to the dialog
- [x] 4.3 Ensure the dialog still pre-checks skills already on the drone's sheet

## 5. Lint and typecheck

- [x] 5.1 Run `npm run lint` and fix any errors
- [x] 5.2 Run `npx tsc --noEmit` and fix any type errors
