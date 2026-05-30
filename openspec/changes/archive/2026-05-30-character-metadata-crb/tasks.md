## 1. DB Schema — Reference Tables

- [x] 1.1 Add `races`, `classes`, and `themes` tables to `src/db/schema.ts` (id uuid PK, name text not null, source text not null default 'CRB')
- [x] 1.2 Add `race_id`, `class_id`, `theme_id` nullable FK columns to the `characters` table in `src/db/schema.ts`
- [x] 1.3 Export inferred types for the three new tables from `src/db/schema.ts`

## 2. DB Migration — Tables + Seed Data

- [x] 2.1 Generate a Drizzle migration for the schema changes (`npx drizzle-kit generate`)
- [x] 2.2 Edit the generated migration SQL to append INSERT statements seeding all 8 CRB races, 7 CRB classes, and 10 CRB themes with fixed UUIDs
- [x] 2.3 Apply the migration to the local dev database (`npx drizzle-kit migrate`)

## 3. DB Queries

- [x] 3.1 Add `getRaces()`, `getClasses()`, `getThemes()` query functions to `src/db/queries/characters.ts` (or a new `src/db/queries/reference.ts`)
- [x] 3.2 Update `createCharacter` query to accept and store `race_id`, `class_id`, `theme_id`
- [x] 3.3 Update `updateCharacter` query to accept and store `race_id`, `class_id`, `theme_id`
- [x] 3.4 Update `getCharacterWithCampaigns` to join and return race name, class name, and theme name alongside the character

## 4. Server Actions

- [x] 4.1 Update `createCharacterAction` in `/dashboard/characters/new/actions.ts` to read and validate `race_id`, `class_id`, `theme_id` from form data
- [x] 4.2 Update `updateCharacterAction` in `/dashboard/characters/[id]/edit/actions.ts` to read and validate `race_id`, `class_id`, `theme_id` from form data

## 5. Character Creation Page

- [x] 5.1 Convert `/dashboard/characters/new/page.tsx` to a server component that loads races, classes, and themes from DB and passes them to the form
- [x] 5.2 Extract the client form into `_new-form.tsx` and add Race, Class, and Theme `<select>` dropdowns (all required)

## 6. Character Detail Page

- [x] 6.1 Update the character detail page to display race, class, and theme names (show "—" when null)

## 7. Character Edit Page

- [x] 7.1 Update `/dashboard/characters/[id]/edit/page.tsx` to load races, classes, and themes from DB and pass them (with current character selections) to the edit form
- [x] 7.2 Update `_edit-form.tsx` to include Race, Class, and Theme dropdowns pre-populated with the character's current values

## 8. Lint + Typecheck

- [x] 8.1 Run `npm run lint` and fix any issues
- [x] 8.2 Run `npx tsc --noEmit` and fix any type errors
