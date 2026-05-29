## 1. Install Dependencies

- [x] 1.1 Install `drizzle-orm` and `postgres` as production dependencies
- [x] 1.2 Install `drizzle-kit` as a dev dependency

## 2. Configuration

- [x] 2.1 Create `drizzle.config.ts` at the project root pointing to `src/db/schema.ts` and `drizzle/migrations/` output directory
- [x] 2.2 Add `DATABASE_URL` to `.env.local.example` with comments explaining direct vs pooler connection strings for Supabase

## 3. Database Client

- [x] 3.1 Create `src/db/index.ts` exporting a Drizzle client singleton initialized from `DATABASE_URL`, with a startup error if the env var is missing
- [x] 3.2 Add `server-only` package and import it in `src/db/index.ts` to prevent client-side imports

## 4. Schema

- [x] 4.1 Create `src/db/schema.ts` with a placeholder comment and at least one minimal table export (or an empty export) so Drizzle Kit can parse the file

## 5. NPM Scripts

- [x] 5.1 Add `"db:generate": "drizzle-kit generate"` script to `package.json`
- [x] 5.2 Add `"db:migrate": "drizzle-kit migrate"` script to `package.json`
- [x] 5.3 Add `"db:studio": "drizzle-kit studio"` script to `package.json`

## 6. Initial Migration

- [x] 6.1 Run `npm run db:generate` to emit the initial migration file into `drizzle/migrations/`
- [x] 6.2 Verify `drizzle/migrations/` directory and generated `.sql` file are not in `.gitignore`
