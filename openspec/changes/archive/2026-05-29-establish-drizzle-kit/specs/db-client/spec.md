## ADDED Requirements

### Requirement: Singleton database client
The system SHALL export a single Drizzle client instance from `src/db/index.ts` initialized using the `DATABASE_URL` environment variable. The client SHALL be reused across requests within the same process (module-level singleton).

#### Scenario: Client initializes successfully
- **WHEN** `DATABASE_URL` is set to a valid Postgres connection string
- **THEN** importing `src/db/index.ts` returns a Drizzle client without throwing

#### Scenario: Missing DATABASE_URL
- **WHEN** `DATABASE_URL` is not set or is an empty string
- **THEN** the module SHALL throw an error at initialization time with a descriptive message indicating the missing variable

### Requirement: Server-only client
The database client SHALL only be usable in server-side code (Server Components, Route Handlers, Server Actions). It MUST NOT be importable from client components.

#### Scenario: Client is not shipped to the browser
- **WHEN** a client component attempts to import `src/db/index.ts`
- **THEN** Next.js SHALL throw a build/runtime error preventing the import (enforced via `server-only` package or equivalent)
