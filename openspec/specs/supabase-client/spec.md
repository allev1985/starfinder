## ADDED Requirements

### Requirement: Server Supabase client
The system SHALL provide a `createClient` function exported from `src/lib/supabase/server.ts` that creates a Supabase client suitable for use in Server Components, Route Handlers, and Server Actions. It SHALL read cookies using Next.js `cookies()`.

#### Scenario: Server client is created successfully
- **WHEN** `createClient()` from `src/lib/supabase/server.ts` is called inside a Server Component
- **THEN** a Supabase client is returned with access to the current request's cookie-based session

#### Scenario: Server client is server-only
- **WHEN** a client component attempts to import `src/lib/supabase/server.ts`
- **THEN** Next.js SHALL throw an error preventing the import (enforced via `server-only` package)

### Requirement: Browser Supabase client
The system SHALL provide a `createClient` function exported from `src/lib/supabase/client.ts` that creates a Supabase client suitable for use in Client Components. It SHALL use `createBrowserClient` from `@supabase/ssr`.

#### Scenario: Browser client initializes
- **WHEN** `createClient()` from `src/lib/supabase/client.ts` is called in a Client Component
- **THEN** a Supabase client is returned that manages its own session state in the browser

### Requirement: Clients sourced from environment variables
Both server and browser clients SHALL read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from environment variables. Missing variables SHALL cause a startup error.

#### Scenario: Missing env vars throw at initialization
- **WHEN** either `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is not set
- **THEN** the client factory SHALL throw an error with a descriptive message identifying the missing variable
