## Context

The Starfinder Gaming Sheet is a Next.js 16 app with no existing database layer. As the app grows to persist character data, game state, and user preferences, a type-safe ORM with version-controlled migrations is required. Drizzle ORM is chosen for its zero-overhead TypeScript types, SQL-like schema DSL, and first-class Drizzle Kit CLI for migration generation.

The target database is PostgreSQL — specifically Supabase Postgres (Supabase MCP is already connected to this project). The `postgres` npm driver will be used server-side via Next.js Server Components and Route Handlers.

## Goals / Non-Goals

**Goals:**
- Install and configure Drizzle ORM + Drizzle Kit for a Postgres database
- Define a `src/db/` module with a typed client singleton and schema file
- Configure `drizzle.config.ts` so `drizzle-kit generate` and `drizzle-kit migrate` work out of the box
- Add npm convenience scripts for migration workflows
- Provide an initial empty schema as the foundation for future table additions

**Non-Goals:**
- Defining application-specific tables (character sheets, inventory, etc.) — those come in future changes
- Setting up a local Postgres instance or Docker Compose — developers use Supabase's hosted Postgres
- Authentication or RLS policies — out of scope for this change
- ORM query abstractions or repository patterns — raw Drizzle queries are sufficient initially

## Decisions

### D1: Drizzle ORM over Prisma

**Decision**: Use Drizzle ORM.
**Rationale**: Drizzle's schema is plain TypeScript (no `.prisma` DSL), queries are SQL-transparent, and it has no runtime code generation step. This aligns better with Next.js 16's Edge/Server Component model where cold starts matter.
**Alternatives considered**: Prisma — heavier binary, requires `prisma generate`, and the schema DSL is a separate language.

### D2: `postgres` npm driver (not `pg`)

**Decision**: Use the `postgres` npm package as the database driver.
**Rationale**: `postgres` is the driver recommended in Drizzle's own Supabase guide, has no native bindings (pure JS), and is friendlier to serverless/edge environments.
**Alternatives considered**: `pg` (node-postgres) — works but requires `pg-pool` for connection pooling and is heavier.

### D3: Connection via `DATABASE_URL` environment variable

**Decision**: Read a single `DATABASE_URL` (Postgres connection string) from the environment.
**Rationale**: Standard convention; works with Supabase's connection string, Vercel's integration secrets, and local `.env.local`. Drizzle Kit also reads this value natively when specified in `drizzle.config.ts`.

### D4: Migrations stored in `drizzle/` at project root

**Decision**: Output SQL migration files to `drizzle/migrations/` (configurable in `drizzle.config.ts`).
**Rationale**: Keeps generated SQL out of `src/`, makes it clear these are artifacts, and matches Drizzle Kit's default convention. The `drizzle/` directory is committed to git so migration history is version-controlled.

### D5: No auto-migration on app startup

**Decision**: Migrations are applied explicitly via `npm run db:migrate`, not automatically when the Next.js server boots.
**Rationale**: Auto-migration in serverless/edge environments can cause race conditions across concurrent cold starts. Explicit migration is safer for production deployments.

## Risks / Trade-offs

- **`DATABASE_URL` required at build time** → If Next.js attempts to import the db client in a static page, the build will fail without the env var. Mitigation: keep db imports inside Server Components / Route Handlers only; do not import from client components or `generateStaticParams`.
- **Supabase connection pooling** → Supabase requires using the connection pooler URL (port 6543) for serverless, not the direct URL (port 5432). Mitigation: document both URLs in `.env.local.example` and note which to use.
- **Schema drift** → If a developer edits the database directly without running `drizzle-kit generate`, the schema and migrations diverge. Mitigation: always use `npm run db:generate` after any schema change.

## Migration Plan

1. Install packages (`drizzle-orm`, `drizzle-kit`, `postgres`)
2. Add `drizzle.config.ts` at project root
3. Create `src/db/index.ts` (client singleton) and `src/db/schema.ts` (empty schema)
4. Add npm scripts: `db:generate`, `db:migrate`, `db:studio`
5. Run `npm run db:generate` to emit the initial (empty) migration
6. Commit `drizzle/` directory alongside source changes

No rollback complexity — this is additive only.

## Open Questions

- **Which Supabase connection string to use by default in docs?** Direct (5432) for local dev, pooler (6543) for production — should be documented clearly in `.env.local.example`.
