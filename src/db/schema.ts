// Database schema — add tables here using Drizzle's pgTable builder.
// After each change, run `npm run db:generate` to produce a migration file.
import { pgTable, serial, text } from "drizzle-orm/pg-core";

// Placeholder table — replace or extend with real Starfinder entities.
export const placeholder = pgTable("placeholder", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});
