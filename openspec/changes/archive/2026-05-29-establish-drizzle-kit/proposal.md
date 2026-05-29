## Why

The project currently has no database layer — no ORM, no schema definitions, and no migration tooling. Drizzle ORM with Drizzle Kit provides a type-safe, schema-first database solution that integrates cleanly with Next.js and generates SQL migrations tracked in version control.

## What Changes

- Add `drizzle-orm` and `drizzle-kit` as dependencies
- Add a database driver (`postgres` via `pg` or `@neondatabase/serverless` / Supabase's Postgres)
- Create a `src/db/` directory with schema definitions and a database client singleton
- Add `drizzle.config.ts` at the project root for Drizzle Kit configuration
- Add `migrate` and `generate` npm scripts for migration workflows
- Add the initial database migration output directory (`drizzle/`)

## Capabilities

### New Capabilities

- `db-client`: Singleton Drizzle client initialized from environment variables, exported for use throughout the app
- `db-schema`: TypeScript schema definitions for all database tables using Drizzle's schema builder
- `db-migrations`: Drizzle Kit migration generation and application workflow (generate → apply)

### Modified Capabilities

<!-- None — this is a greenfield database setup -->

## Impact

- **New dependencies**: `drizzle-orm`, `drizzle-kit`, `postgres` (or equivalent Supabase-compatible driver)
- **New files**: `drizzle.config.ts`, `src/db/index.ts`, `src/db/schema.ts`, `drizzle/` migrations directory
- **Environment variables**: `DATABASE_URL` (Postgres connection string) required at runtime and build time
- **No breaking changes** to existing routes or components — purely additive
