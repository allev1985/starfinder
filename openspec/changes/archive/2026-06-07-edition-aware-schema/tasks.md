## 1. Schema — editions table and edition_id columns

- [x] 1.1 Add `editions` table to `src/db/schema.ts` with `id`, `slug`, `name` columns and export `Edition` / `NewEdition` types
- [x] 1.2 Add `editionId` FK column to the `characters` table definition in `src/db/schema.ts`
- [x] 1.3 Add `editionId` FK column to the `campaigns` table definition in `src/db/schema.ts`
- [x] 1.4 Add `editionId` FK column to `weapons`, `armor`, `skills`, `classes`, `themes`, `races`, `feats`, `spells`, `chassis` table definitions in `src/db/schema.ts`
- [x] 1.5 Add `editionId` FK column to `classAbilities`, `themeAbilities`, `raceDescriptions` table definitions in `src/db/schema.ts`
- [x] 1.6 Run `npm run db:generate` and verify a new migration file is produced in `supabase/migrations/`

## 2. Migration — create editions, seed 1e, backfill

- [x] 2.1 Write (or verify generated) migration: create `editions` table and insert the 1e seed row with a hardcoded UUID (e.g. `'00000000-0000-0000-0000-000000000001'` or a proper v4 UUID)
- [x] 2.2 Write backfill migration: add nullable `edition_id` to all target tables, `UPDATE … SET edition_id = '<1e-uuid>'`, then `ALTER COLUMN edition_id SET NOT NULL`
- [x] 2.3 Apply migrations locally with `npm run db:migrate` and confirm no errors

## 3. Application — character and campaign create paths

- [x] 3.1 Look up (or hardcode) the 1e edition UUID in `src/app/dashboard/characters/new/actions.ts` and pass `editionId` when inserting a new character
- [x] 3.2 Look up (or hardcode) the 1e edition UUID in `src/app/dashboard/campaigns/new/actions.ts` and pass `editionId` when inserting a new campaign

## 4. Character sheet — edition branch point

- [x] 4.1 Update `character-sheet-loader.ts` (or equivalent query) to join `editions` and return `edition.slug` on the character object
- [x] 4.2 In `src/app/dashboard/characters/[id]/page.tsx`, add an edition branch: `edition.slug === '1e'` renders the existing sheet; anything else calls `notFound()`

## 5. Lint and type-check

- [x] 5.1 Run `npm run lint` and fix any errors
- [x] 5.2 Run `npx tsc --noEmit` and fix any type errors
