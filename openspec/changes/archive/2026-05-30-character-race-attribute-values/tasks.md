## 1. Database

- [x] 1.1 Add migration file for `character_race_attribute_values` table with composite PK `(character_id, attribute_id)` and cascade deletes
- [x] 1.2 Add `characterRaceAttributeValues` table definition to `src/db/schema.ts` with Drizzle types
- [x] 1.3 Push migration to local Supabase (`supabase db push` or `drizzle-kit push`) and confirm table exists

## 2. Queries & Server Action

- [x] 2.1 Add `getCharacterRaceAttributeValues(characterId)` query to `src/db/queries/characters.ts`
- [x] 2.2 Add `upsertCharacterRaceAttributeValue` server action (with owner authorization check) under `src/app/dashboard/characters/[id]/actions.ts`

## 3. UI Component

- [x] 3.1 Create `src/app/dashboard/characters/[id]/_components/description-section.tsx` — accepts `attributes`, `savedValues`, `characterId`, `isOwner`; renders editable inputs (owner) or read-only pairs (non-owner)
- [x] 3.2 Wire inline auto-save: each input calls the upsert action `onBlur`

## 4. Character Detail Page

- [x] 4.1 In `src/app/dashboard/characters/[id]/page.tsx`, fetch race attributes (`type='description'`) and saved values in parallel when `character.raceId` is set
- [x] 4.2 Render `<DescriptionSection>` below the existing header info; hide entirely if no race is selected

## 5. Lint & Typecheck

- [x] 5.1 Run `npm run lint` and fix any issues
- [x] 5.2 Run `npx tsc --noEmit` and fix any type errors
