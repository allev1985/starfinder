## 1. Schema

- [x] 1.1 Add `skills` table to `src/db/schema.ts` with columns: `id` (uuid PK), `name` (text), `ability` (text), `trained_only` (boolean), `armor_check_penalty` (boolean)
- [x] 1.2 Add `class_skills` join table to `src/db/schema.ts` with columns: `skill_id` (uuid FK → skills), `class_id` (uuid FK → classes), composite PK on both

## 2. Migration

- [x] 2.1 Create `supabase/migrations/0019_skills_seed.sql` with DDL for both tables
- [x] 2.2 Add INSERT statements for all 20 CRB skills using `d1000000-0000-0000-0000-0000000000XX` UUID pattern
- [x] 2.3 Add INSERT statements for all `class_skills` rows (all 7 CRB classes)
- [x] 2.4 Apply migration via Supabase MCP or SQL editor

## 3. Validation

- [x] 3.1 Run `npm run lint` and `npx tsc --noEmit` — fix any errors
