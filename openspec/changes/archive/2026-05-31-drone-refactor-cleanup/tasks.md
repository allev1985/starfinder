## 1. Fix race_descriptions data

- [x] 1.1 Write migration to UPDATE the 5 drone description rows (`f2000000-0000-0000-0000-000000000001` through `000000000005`) from `race_type = 'biological'` to `race_type = 'drone'`
- [x] 1.2 Apply migration and verify: `race_descriptions` has exactly 7 biological rows and exactly 5 drone rows

## 2. Extract shared DRONE_SKILL_NAMES constant

- [x] 2.1 Create `src/lib/drone.ts` exporting `DRONE_SKILL_NAMES` as a `readonly string[]`
- [x] 2.2 Update `src/db/queries/reference.ts` to import `DRONE_SKILL_NAMES` from `src/lib/drone.ts` and remove the local definition
- [x] 2.3 Update `src/app/dashboard/characters/[id]/_components/skills-section.tsx` to import `DRONE_SKILL_NAMES` from `src/lib/drone.ts` and remove the local `const`

## 3. Rename ANDROID_ROWS

- [x] 3.1 Rename `ANDROID_ROWS` → `DRONE_ROWS` in `src/app/dashboard/characters/[id]/_components/health-resolve-section.tsx`

## 4. Update race-descriptions spec

- [x] 4.1 Update `openspec/specs/race-descriptions/spec.md` to reflect `'biological' | 'drone'` enum and correct drone field list (merge from delta spec)

## 5. Lint and typecheck

- [x] 5.1 Run `npm run lint` and fix any errors
- [x] 5.2 Run `npx tsc --noEmit` and fix any type errors
