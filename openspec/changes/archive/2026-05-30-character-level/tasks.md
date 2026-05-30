## 1. DB Schema + Migration

- [x] 1.1 Add `level` integer column (NOT NULL, DEFAULT 1) to the `characters` table in `src/db/schema.ts`
- [x] 1.2 Generate the Drizzle migration (`npx drizzle-kit generate`)
- [x] 1.3 Apply the migration to the local dev database (`npx supabase migration up --local`)

## 2. Query + Service Layer

- [x] 2.1 Add a `updateCharacterLevel` query function to `src/db/queries/characters.ts` that accepts `characterId` and `level` and updates only the level column
- [x] 2.2 Add `updateCharacterLevelForOwner(characterId, userId, level)` to `src/services/characters.ts` — validates ownership and clamps level to 1–20

## 3. Server Action

- [x] 3.1 Create `src/app/dashboard/characters/[id]/actions.ts` with `updateCharacterLevelAction(characterId, level)` — validates level is 1–20, calls the service, returns success/error

## 4. Inline Level Control Component

- [x] 4.1 Create `src/app/dashboard/characters/[id]/_components/level-control.tsx` as a `"use client"` component that accepts `characterId` and initial `level`, renders − / + buttons, calls `updateCharacterLevelAction` optimistically, and disables buttons at bounds

## 5. Character Detail Page

- [x] 5.1 Update `getCharacterWithCampaigns` return type / query to include `level` (it will automatically be included since `Character` type now has the column — verify this is the case)
- [x] 5.2 Update `/dashboard/characters/[id]/page.tsx` to display level for all viewers and render `<LevelControl>` for the owner (read-only level text for non-owners)

## 6. Lint + Typecheck

- [x] 6.1 Run `npm run lint` and fix any issues
- [x] 6.2 Run `npx tsc --noEmit` and fix any type errors
