## ADDED Requirements

### Requirement: Migration generation command
The system SHALL provide a `db:generate` npm script that runs `drizzle-kit generate` to produce SQL migration files from schema changes.

#### Scenario: Generate produces SQL file
- **WHEN** a developer runs `npm run db:generate` after editing `src/db/schema.ts`
- **THEN** a new timestamped `.sql` file SHALL appear in `drizzle/migrations/`

### Requirement: Migration application command
The system SHALL provide a `db:migrate` npm script that runs `drizzle-kit migrate` to apply all pending SQL migrations to the target database.

#### Scenario: Migrate applies pending migrations
- **WHEN** a developer runs `npm run db:migrate` with `DATABASE_URL` pointing to a Postgres database
- **THEN** all unapplied migration files in `drizzle/migrations/` SHALL be executed in order against the database

#### Scenario: Migrate is idempotent for applied migrations
- **WHEN** `npm run db:migrate` is run a second time with no new migrations
- **THEN** no SQL is re-executed and the command exits successfully

### Requirement: Drizzle Kit configuration file
The system SHALL include a `drizzle.config.ts` at the project root that specifies the schema path, migrations output directory, and database credentials source.

#### Scenario: Config is valid
- **WHEN** `npx drizzle-kit check` is run
- **THEN** it SHALL exit with code 0, confirming the config is recognized and the schema is parseable

### Requirement: Studio command
The system SHALL provide a `db:studio` npm script that launches Drizzle Studio for visual database inspection.

#### Scenario: Studio launches
- **WHEN** a developer runs `npm run db:studio` with a valid `DATABASE_URL`
- **THEN** Drizzle Studio SHALL start and be accessible at its default local URL

### Requirement: Migrations directory is version-controlled
The `drizzle/migrations/` directory and all generated `.sql` files SHALL be committed to git. The directory SHALL NOT be listed in `.gitignore`.

#### Scenario: Migrations are tracked
- **WHEN** a developer generates a new migration and runs `git status`
- **THEN** the new `.sql` file SHALL appear as an untracked file ready to be staged
