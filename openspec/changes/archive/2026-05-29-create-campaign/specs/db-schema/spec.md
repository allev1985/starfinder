## REMOVED Requirements

### Requirement: TypeScript schema file
**Reason**: Requirement content unchanged — only the placeholder export example is updated to reflect real tables. Superseded by the updated version below.
**Migration**: No action required; the file path and export convention remain identical.

## MODIFIED Requirements

### Requirement: TypeScript schema file
The system SHALL provide a `src/db/schema.ts` file that defines all database tables using Drizzle ORM's schema builder (`pgTable`). The file SHALL be the single source of truth for the database schema. The placeholder table SHALL be replaced with real domain tables (`campaigns`, `characters`, `campaign_characters`).

#### Scenario: Schema file exists and exports
- **WHEN** the project is built
- **THEN** `src/db/schema.ts` SHALL exist and export the `campaigns`, `characters`, and `campaign_characters` table definitions
