## 1. Database

- [x] 1.1 Add migration: `ALTER TABLE spaceships ADD COLUMN tier text, ADD COLUMN maneuverability text, ADD COLUMN power_core_name text, ADD COLUMN power_core_pcu integer, ADD COLUMN drift_engine text`
- [x] 1.2 Update `spaceships` table definition in `src/db/schema.ts` with the five new nullable columns

## 2. Server Action

- [x] 2.1 Expand the `Pick<Spaceship, ...>` type in `updateSpaceshipAction` in `actions.ts` to include `tier`, `maneuverability`, `powerCoreName`, `powerCorePcu`, `driftEngine`

## 3. UI

- [x] 3.1 Add `tier` and `maneuverability` to `TEXT_FIELDS` array in `_name-editor.tsx`
- [x] 3.2 Add `powerCorePcu` to the numeric field types and state in `_name-editor.tsx`
- [x] 3.3 Add `driftEngine` to `TEXT_FIELDS` array in `_name-editor.tsx`
- [x] 3.4 Render `powerCoreName` (text) + `powerCorePcu` (integer) as a paired row in the basic info section
- [x] 3.5 Render `driftEngine` (text) alongside existing `driftRating` (integer) as a paired row

## 4. Verification

- [x] 4.1 Run `npm run lint` and `npx tsc --noEmit` — zero errors
- [ ] 4.2 Manually verify all five new fields save correctly via debounced onChange in the browser
