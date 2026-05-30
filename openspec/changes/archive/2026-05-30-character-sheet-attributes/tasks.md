## 1. DB Schema

- [x] 1.1 Add `race_attributes` table to `src/db/schema.ts` (id, race_id FK, type, name, input_type, description nullable, sort_order)
- [x] 1.2 Add `class_attributes` table to `src/db/schema.ts` (same shape, class_id FK)
- [x] 1.3 Add `theme_attributes` table to `src/db/schema.ts` (same shape, theme_id FK)
- [x] 1.4 Export inferred types for all three tables

## 2. Migration — Tables

- [x] 2.1 Generate Drizzle migration (`npx drizzle-kit generate`)

## 3. Migration — Seed Data

- [x] 3.1 Append seed INSERTs for Android race attributes (movement, senses, racial traits)
- [x] 3.2 Append seed INSERTs for Human race attributes
- [x] 3.3 Append seed INSERTs for Kasatha race attributes
- [x] 3.4 Append seed INSERTs for Lashunta (Damaya) race attributes
- [x] 3.5 Append seed INSERTs for Lashunta (Korasha) race attributes
- [x] 3.6 Append seed INSERTs for Shirren race attributes
- [x] 3.7 Append seed INSERTs for Vesk race attributes
- [x] 3.8 Append seed INSERTs for Ysoki race attributes
- [x] 3.9 Append seed INSERTs for all 7 CRB class attributes (Envoy, Mechanic, Mystic, Operative, Solarian, Soldier, Technomancer)
- [x] 3.10 Append seed INSERTs for all 10 CRB theme attributes
- [x] 3.11 Apply migration (`npx supabase migration up --local`)

## 4. Query Functions

- [x] 4.1 Add `getRaceAttributes(raceId)` to `src/db/queries/reference.ts`, ordered by sort_order
- [x] 4.2 Add `getClassAttributes(classId)` to `src/db/queries/reference.ts`, ordered by sort_order
- [x] 4.3 Add `getThemeAttributes(themeId)` to `src/db/queries/reference.ts`, ordered by sort_order

## 5. Lint + Typecheck

- [x] 5.1 Run `npm run lint` and fix any issues
- [x] 5.2 Run `npx tsc --noEmit` and fix any type errors
