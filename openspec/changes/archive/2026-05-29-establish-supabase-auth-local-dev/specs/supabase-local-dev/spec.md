## ADDED Requirements

### Requirement: Local Supabase stack via CLI
The system SHALL include a `supabase/` directory initialized with the Supabase CLI so that `supabase start` launches a full local Postgres + Auth stack using Docker.

#### Scenario: Local stack starts
- **WHEN** a developer runs `supabase start` from the project root
- **THEN** a local Postgres instance, GoTrue auth server, and Supabase Studio are available at their default local ports

#### Scenario: Local migrations applied on start
- **WHEN** `supabase start` completes
- **THEN** all SQL files in `supabase/migrations/` are applied to the local database automatically

### Requirement: Environment variable switching between local and remote
The system SHALL document the environment variables needed for both local development and remote (Supabase cloud) usage in `.env.local.example`.

#### Scenario: Developer can switch between local and remote
- **WHEN** a developer sets `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to local values (from `supabase status`)
- **THEN** the app connects to the local Supabase stack instead of the remote project

### Requirement: Local stack does not require remote credentials
The local development stack SHALL function without any remote Supabase project credentials. All auth and database operations SHALL work entirely within the local Docker environment.

#### Scenario: Offline local development
- **WHEN** a developer starts the app with local env vars and no internet connection
- **THEN** auth and database operations succeed using the local Docker stack
