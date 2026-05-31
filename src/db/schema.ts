import { pgTable, uuid, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";

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

export const raceAttributes = pgTable("race_attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  raceId: uuid("race_id").notNull().references(() => races.id),
  type: text("type").notNull(),
  name: text("name").notNull(),
  inputType: text("input_type").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull(),
});

export const classAttributes = pgTable("class_attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  classId: uuid("class_id").notNull().references(() => classes.id),
  type: text("type").notNull(),
  name: text("name").notNull(),
  inputType: text("input_type").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull(),
});

export const themeAttributes = pgTable("theme_attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  themeId: uuid("theme_id").notNull().references(() => themes.id),
  type: text("type").notNull(),
  name: text("name").notNull(),
  inputType: text("input_type").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull(),
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
  level: integer("level").notNull().default(1),
  strScore: integer("str_score").notNull().default(10),
  dexScore: integer("dex_score").notNull().default(10),
  conScore: integer("con_score").notNull().default(10),
  intScore: integer("int_score").notNull().default(10),
  wisScore: integer("wis_score").notNull().default(10),
  chaScore: integer("cha_score").notNull().default(10),
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

export const characterCombatStats = pgTable("character_combat_stats", {
  characterId: uuid("character_id").primaryKey().references(() => characters.id, { onDelete: "cascade" }),
  initiativeMiscMod: integer("initiative_misc_mod").notNull().default(0),
  baseAttackBonus: integer("base_attack_bonus").notNull().default(0),
  staminaPointsTotal: integer("stamina_points_total").notNull().default(0),
  staminaPointsCurrent: integer("stamina_points_current").notNull().default(0),
  hitPointsTotal: integer("hit_points_total").notNull().default(0),
  hitPointsCurrent: integer("hit_points_current").notNull().default(0),
  resolvePointsTotal: integer("resolve_points_total").notNull().default(0),
  resolvePointsCurrent: integer("resolve_points_current").notNull().default(0),
  eacArmorBonus: integer("eac_armor_bonus").notNull().default(0),
  eacMiscMod: integer("eac_misc_mod").notNull().default(0),
  kacArmorBonus: integer("kac_armor_bonus").notNull().default(0),
  kacMiscMod: integer("kac_misc_mod").notNull().default(0),
  fortBaseSave: integer("fort_base_save").notNull().default(0),
  fortMiscMod: integer("fort_misc_mod").notNull().default(0),
  refBaseSave: integer("ref_base_save").notNull().default(0),
  refMiscMod: integer("ref_misc_mod").notNull().default(0),
  willBaseSave: integer("will_base_save").notNull().default(0),
  willMiscMod: integer("will_misc_mod").notNull().default(0),
});

export const characterRaceAttributeValues = pgTable(
  "character_race_attribute_values",
  {
    characterId: uuid("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    attributeId: uuid("attribute_id")
      .notNull()
      .references(() => raceAttributes.id, { onDelete: "cascade" }),
    value: text("value").notNull().default(""),
  },
  (t) => [primaryKey({ columns: [t.characterId, t.attributeId] })]
);

export type RaceAttribute = typeof raceAttributes.$inferSelect;
export type ClassAttribute = typeof classAttributes.$inferSelect;
export type ThemeAttribute = typeof themeAttributes.$inferSelect;
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
export type CharacterRaceAttributeValue = typeof characterRaceAttributeValues.$inferSelect;
export type CharacterCombatStats = typeof characterCombatStats.$inferSelect;
