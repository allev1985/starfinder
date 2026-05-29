## MODIFIED Requirements

### Requirement: Migration generation command
The system SHALL provide a `db:generate` npm script that runs `drizzle-kit generate` to produce SQL migration files from schema changes. Generated files SHALL be written to `supabase/migrations/`.

#### Scenario: Generate produces SQL file
- **WHEN** a developer runs `npm run db:generate` after editing `src/db/schema.ts`
- **THEN** a new timestamped `.sql` file SHALL appear in `supabase/migrations/`

### Requirement: Migration application command
The system SHALL provide a `db:migrate` npm script that runs `supabase migration up` to apply all pending SQL migrations in `supabase/migrations/` to the local running Supabase stack.

#### Scenario: Migrate applies pending migrations
- **WHEN** a developer runs `npm run db:migrate` with the local Supabase stack running (`supabase start`)
- **THEN** all unapplied migration files in `supabase/migrations/` SHALL be executed in order against the local database

#### Scenario: Migrate is idempotent for applied migrations
- **WHEN** `npm run db:migrate` is run a second time with no new migrations
- **THEN** no SQL is re-executed and the command exits successfully

### Requirement: Drizzle Kit configuration file
The system SHALL include a `drizzle.config.ts` at the project root that specifies the schema path as `src/db/schema.ts`, the migrations output directory as `supabase/migrations/`, and reads database credentials from `DATABASE_URL`.

#### Scenario: Config is valid
- **WHEN** `npx drizzle-kit check` is run
- **THEN** it SHALL exit with code 0, confirming the config is recognized and the schema is parseable

### Requirement: Migrations directory is version-controlled
The `supabase/migrations/` directory and all generated `.sql` files SHALL be committed to git. The directory SHALL NOT be listed in `.gitignore`.

#### Scenario: Migrations are tracked
- **WHEN** a developer generates a new migration and runs `git status`
- **THEN** the new `.sql` file SHALL appear as an untracked file ready to be staged

## REMOVED Requirements

### Requirement: Studio command
**Reason**: Drizzle Studio (`npm run db:studio`) is superseded by Supabase Studio, which is available at `http://localhost:54323` when the local stack is running and at the Supabase dashboard for the remote project.
**Migration**: Use `supabase start` and navigate to `http://localhost:54323` for local DB inspection.
