import { pgTable, uuid, text, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const races = pgTable("races", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const themes = pgTable("themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  dmId: uuid("dm_id").notNull(),
  joinCode: text("join_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const characters = pgTable("characters", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").notNull(),
  raceId: uuid("race_id").references(() => races.id),
  classId: uuid("class_id").references(() => classes.id),
  themeId: uuid("theme_id").references(() => themes.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const campaignCharacters = pgTable(
  "campaign_characters",
  {
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id),
    characterId: uuid("character_id")
      .notNull()
      .references(() => characters.id),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.campaignId, t.characterId] })]
);

export type Race = typeof races.$inferSelect;
export type NewRace = typeof races.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type Theme = typeof themes.$inferSelect;
export type NewTheme = typeof themes.$inferInsert;
export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
