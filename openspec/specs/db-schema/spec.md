## ADDED Requirements

### Requirement: TypeScript schema file
The system SHALL provide a `src/db/schema.ts` file that defines all database tables using Drizzle ORM's schema builder (`pgTable`). The file SHALL be the single source of truth for the database schema.

#### Scenario: Schema file exists and exports
- **WHEN** the project is built
- **THEN** `src/db/schema.ts` SHALL exist and export at least one named export (even if the initial schema is empty/placeholder)

### Requirement: Schema is the source of truth for migrations
Any change to the database structure SHALL be made by editing `src/db/schema.ts` first, then running `npm run db:generate` to produce a SQL migration file.

#### Scenario: Schema change produces migration
- **WHEN** a developer adds or modifies a table in `src/db/schema.ts` and runs `npm run db:generate`
- **THEN** Drizzle Kit SHALL produce a new `.sql` file in `drizzle/migrations/` reflecting the schema delta

### Requirement: Schema exports are typed
All table definitions in `src/db/schema.ts` SHALL produce inferred TypeScript types (select and insert) accessible via Drizzle's `$inferSelect` and `$inferInsert` helpers.

#### Scenario: Type inference works
- **WHEN** a developer uses `typeof myTable.$inferSelect`
- **THEN** TypeScript SHALL resolve the correct row shape without any manual type declarations
