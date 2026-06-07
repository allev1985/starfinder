## 1. Database & Schema

- [x] 1.1 Add `conditions` table to `src/db/schema.ts` (id, name, slug, description, editionId FK)
- [x] 1.2 Add `character_conditions` junction table to `src/db/schema.ts` (characterId FK, conditionId FK, composite PK, cascade delete)
- [x] 1.3 Generate and apply Drizzle migration for both new tables
- [x] 1.4 Write migration SQL to add `character_conditions` to the `supabase_realtime` publication

## 2. Admin — Conditions Reference CRUD

- [x] 2.1 Create `src/db/queries/admin-conditions.ts` with `listConditions`, `createCondition`, `updateCondition`, `deleteCondition`
- [x] 2.2 Create server actions file `src/app/dashboard/admin/data/[editionSlug]/conditions/actions.ts`
- [x] 2.3 Create `_conditions-client.tsx` with the data table (Name, Slug, Description truncated, Edit/Delete row actions) and Add/Edit dialog (Name, auto-slug, Description textarea, delete confirmation)
- [x] 2.4 Create `page.tsx` for `/dashboard/admin/data/[editionSlug]/conditions/`
- [x] 2.5 Add "Conditions" card (Activity icon) to the categories array in `src/app/dashboard/admin/data/[editionSlug]/page.tsx`

## 3. Character Queries & Server Actions

- [x] 3.1 Update `src/db/queries/characters.ts` to join `character_conditions` → `conditions` and return active conditions with each character fetch
- [x] 3.2 Create `toggleConditionAction(characterId, conditionId)` in the character actions file — inserts if not present, deletes if present

## 4. Character Context

- [x] 4.1 Add `Condition` type import and `activeConditions: Condition[]` + `setActiveConditions` to `CharacterContextValue` in `character-context.tsx`
- [x] 4.2 Add `initialActiveConditions` prop to `CharacterProvider` and wire up `useState`

## 5. Character Sheet — Conditions Section

- [x] 5.1 Install shadcn Popover component (`npx shadcn@latest add popover`)
- [x] 5.2 Create `src/app/dashboard/characters/[id]/_components/conditions-section.tsx` with active-condition chips, Popover descriptions, remove button (owner only), and "+ Add" button
- [x] 5.3 Create the add-condition dialog inside `conditions-section.tsx` — lists all edition conditions with inline descriptions, active ones checked, tap to toggle (calls `toggleConditionAction`)
- [x] 5.4 Wire `ConditionsSection` into the character sheet page: fetch active conditions server-side, pass as `initialActiveConditions` to `CharacterProvider`, render `<ConditionsSection />` after `<HealthResolveSection />`

## 6. Realtime Sync

- [x] 6.1 Update `character-realtime-sync.tsx` to subscribe to `postgres_changes` INSERT and DELETE on `character_conditions` filtered by `character_id`
- [x] 6.2 Handle INSERT: call `setActiveConditions` adding the new condition (fetch condition details from context or re-query if needed)
- [x] 6.3 Handle DELETE: call `setActiveConditions` removing the deleted condition by id

## 7. Lint & Typecheck

- [x] 7.1 Run `npm run lint` and resolve any errors
- [x] 7.2 Run `npx tsc --noEmit` and resolve any type errors
