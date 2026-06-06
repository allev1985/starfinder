import { pgTable, pgEnum, uuid, text, integer, boolean, timestamp, primaryKey, type AnyPgColumn } from "drizzle-orm/pg-core";

export const equipmentCategory = pgEnum("equipment_category", [
  "augmentation_cybernetic",
  "augmentation_biotech",
  "personal_upgrade",
  "ammunition",
]);

export const augmentationSystem = pgEnum("augmentation_system", [
  "brain",
  "eyes",
  "ears",
  "throat",
  "arm",
  "hand",
  "lungs",
  "spinal_column",
  "feet",
  "skin",
]);

export const raceType = pgEnum("race_type", ["biological", "drone"]);
export const armorType = pgEnum("armor_type", ["light", "heavy", "powered"]);
export const weaponCategory = pgEnum("weapon_category", [
  "small_arms",
  "longarms",
  "heavy",
  "sniper",
  "melee_basic",
  "melee_advanced",
  "grenade",
  "special",
]);

export const weapons = pgTable("weapons", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  itemLevel: integer("item_level").notNull(),
  category: weaponCategory("category").notNull(),
  damageDice: text("damage_dice").notNull(),
  damageTypes: text("damage_types").array().notNull(),
  criticalEffect: text("critical_effect"),
  criticalDice: text("critical_dice"),
  range: text("range"),
  capacity: integer("capacity"),
  usage: integer("usage"),
  bulk: text("bulk").notNull(),
  special: text("special"),
  ammoType: text("ammo_type"),
  sourceBook: text("source_book").notNull().default("crb"),
});

export const armor = pgTable("armor", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: armorType("type").notNull(),
  itemLevel: integer("item_level").notNull(),
  price: integer("price").notNull(),
  eacBonus: integer("eac_bonus").notNull(),
  kacBonus: integer("kac_bonus").notNull(),
  maxDexBonus: integer("max_dex_bonus"),
  armorCheckPenalty: integer("armor_check_penalty").notNull().default(0),
  speedAdjustment: integer("speed_adjustment").notNull().default(0),
  bulk: text("bulk").notNull(),
  upgradeSlots: integer("upgrade_slots").notNull().default(0),
  sourceBook: text("source_book").notNull().default("crb"),
  dr: text("dr"),
  resistances: text("resistances"),
});

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  ability: text("ability").notNull(),
  abilityAlts: text("ability_alts").array(),
  trainedOnly: boolean("trained_only").notNull().default(false),
  armorCheckPenalty: boolean("armor_check_penalty").notNull().default(false),
});

export const classSkills = pgTable("class_skills", {
  skillId: uuid("skill_id").notNull().references(() => skills.id),
  classId: uuid("class_id").notNull().references(() => classes.id),
}, (t) => [primaryKey({ columns: [t.skillId, t.classId] })]);

export const classArmorProficiency = pgTable("class_armor_proficiency", {
  classId: uuid("class_id").notNull().references(() => classes.id),
  armorType: armorType("armor_type").notNull(),
}, (t) => [primaryKey({ columns: [t.classId, t.armorType] })]);

export const chassis = pgTable("chassis", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  bonusSkillId: uuid("bonus_skill_id").references(() => skills.id),
  defaultStr: integer("default_str").notNull().default(10),
  defaultDex: integer("default_dex").notNull().default(10),
  defaultInt: integer("default_int").notNull().default(10),
  defaultWis: integer("default_wis").notNull().default(10),
  defaultCha: integer("default_cha").notNull().default(10),
});

export const races = pgTable("races", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: raceType("type").notNull(),
});

export const spellSchool = pgEnum("spell_school", [
  "abjuration",
  "conjuration",
  "divination",
  "enchantment",
  "evocation",
  "illusion",
  "necromancy",
  "transmutation",
  "universal",
]);

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  skillRanksPerLevel: integer("skill_ranks_per_level").notNull().default(0),
  isSpellcaster: boolean("is_spellcaster").notNull().default(false),
});

export const themes = pgTable("themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const raceDescriptions = pgTable("race_descriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  raceType: raceType("race_type").notNull(),
  name: text("name").notNull(),
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
  chassisId: uuid("chassis_id").references(() => chassis.id),
  mechanicCharacterId: uuid("mechanic_character_id").references((): AnyPgColumn => characters.id),
  level: integer("level").notNull().default(1),
  strScore: integer("str_score").notNull().default(10),
  dexScore: integer("dex_score").notNull().default(10),
  conScore: integer("con_score").notNull().default(10),
  intScore: integer("int_score").notNull().default(10),
  wisScore: integer("wis_score").notNull().default(10),
  chaScore: integer("cha_score").notNull().default(10),
  credits: integer("credits").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  languages: text("languages").array().notNull().default([]),
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

export const spaceships = pgTable("spaceships", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  makeAndModel: text("make_and_model"),
  tier: text("tier"),
  maneuverability: text("maneuverability"),
  speed: text("speed"),
  size: text("size"),
  frame: text("frame"),
  powerCoreName: text("power_core_name"),
  powerCorePcu: integer("power_core_pcu"),
  driftEngine: text("drift_engine"),
  driftRating: integer("drift_rating").notNull().default(0),
  pilotRank: integer("pilot_rank").notNull().default(0),
  sizeMod: integer("size_mod").notNull().default(0),
  armorBonus: integer("armor_bonus").notNull().default(0),
  acMiscMod: integer("ac_misc_mod").notNull().default(0),
  countermeasures: integer("countermeasures").notNull().default(0),
  tlMiscMod: integer("tl_misc_mod").notNull().default(0),
  hullTotal: integer("hull_total").notNull().default(0),
  hullCurrent: integer("hull_current"),
  damageThreshold: integer("damage_threshold").notNull().default(0),
  criticalThreshold: integer("critical_threshold").notNull().default(0),
  shieldForwardTotal: integer("shield_forward_total").notNull().default(0),
  shieldForwardCurrent: integer("shield_forward_current"),
  shieldPortTotal: integer("shield_port_total").notNull().default(0),
  shieldPortCurrent: integer("shield_port_current"),
  shieldStarboardTotal: integer("shield_starboard_total").notNull().default(0),
  shieldStarboardCurrent: integer("shield_starboard_current"),
  shieldAftTotal: integer("shield_aft_total").notNull().default(0),
  shieldAftCurrent: integer("shield_aft_current"),
  shieldRegenPerMin: integer("shield_regen_per_min").notNull().default(0),
  shieldMiscMod: integer("shield_misc_mod").notNull().default(0),
  lifeSupportDamage: text("life_support_damage"),
  sensorsDamage: text("sensors_damage"),
  enginesDamage: text("engines_damage"),
  powerCoreDamage: text("power_core_damage"),
  weaponsForwardDamage: text("weapons_forward_damage"),
  weaponsPortDamage: text("weapons_port_damage"),
  weaponsStarboardDamage: text("weapons_starboard_damage"),
  weaponsAftDamage: text("weapons_aft_damage"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const spaceshipWeapons = pgTable("spaceship_weapons", {
  id: uuid("id").primaryKey().defaultRandom(),
  spaceshipId: uuid("spaceship_id")
    .notNull()
    .references(() => spaceships.id, { onDelete: "cascade" }),
  arc: text("arc").notNull(),
  name: text("name").notNull(),
  damage: text("damage"),
  range: text("range"),
  special: text("special"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const spaceshipNotes = pgTable("spaceship_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  spaceshipId: uuid("spaceship_id")
    .notNull()
    .references(() => spaceships.id, { onDelete: "cascade" }),
  section: text("section").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const spaceshipCrew = pgTable("spaceship_crew", {
  id: uuid("id").primaryKey().defaultRandom(),
  spaceshipId: uuid("spaceship_id")
    .notNull()
    .references(() => spaceships.id, { onDelete: "cascade" }),
  characterId: uuid("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

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
  eacMiscMod: integer("eac_misc_mod").notNull().default(0),
  kacMiscMod: integer("kac_misc_mod").notNull().default(0),
  fortBaseSave: integer("fort_base_save").notNull().default(0),
  fortMiscMod: integer("fort_misc_mod").notNull().default(0),
  refBaseSave: integer("ref_base_save").notNull().default(0),
  refMiscMod: integer("ref_misc_mod").notNull().default(0),
  willBaseSave: integer("will_base_save").notNull().default(0),
  willMiscMod: integer("will_misc_mod").notNull().default(0),
  meleeAttackMiscMod: integer("melee_attack_misc_mod").notNull().default(0),
  rangedAttackMiscMod: integer("ranged_attack_misc_mod").notNull().default(0),
  thrownAttackMiscMod: integer("thrown_attack_misc_mod").notNull().default(0),
});

export const characterSkills = pgTable("character_skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  characterId: uuid("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  skillId: uuid("skill_id").notNull().references(() => skills.id),
  label: text("label"),
  abilityOverride: text("ability_override"),
  ranks: integer("ranks").notNull().default(0),
  miscMod: integer("misc_mod").notNull().default(0),
});

export const characterWeapons = pgTable(
  "character_weapons",
  {
    characterId: uuid("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    weaponId: uuid("weapon_id")
      .notNull()
      .references(() => weapons.id),
  },
  (t) => [primaryKey({ columns: [t.characterId, t.weaponId] })]
);

export const characterArmor = pgTable("character_armor", {
  id: uuid("id").primaryKey().defaultRandom(),
  characterId: uuid("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  armorId: uuid("armor_id")
    .notNull()
    .references(() => armor.id),
  worn: boolean("worn").notNull().default(false),
});

export const characterDescriptions = pgTable(
  "character_descriptions",
  {
    characterId: uuid("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    descriptionId: uuid("description_id")
      .notNull()
      .references(() => raceDescriptions.id, { onDelete: "cascade" }),
    value: text("value").notNull().default(""),
  },
  (t) => [primaryKey({ columns: [t.characterId, t.descriptionId] })]
);

export const equipment = pgTable("equipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: equipmentCategory("category").notNull(),
  itemLevel: integer("item_level").notNull(),
  price: integer("price").notNull(),
  bulk: text("bulk").notNull(),
  system: augmentationSystem("system"),
  ammoType: text("ammo_type"),
  ammoCapacity: integer("ammo_capacity"),
  bonusHint: text("bonus_hint"),
  sourceBook: text("source_book").notNull().default("crb"),
});

export const characterEquipment = pgTable("character_equipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  characterId: uuid("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  equipmentId: uuid("equipment_id")
    .notNull()
    .references(() => equipment.id),
  quantity: integer("quantity").notNull().default(1),
  currentCharges: integer("current_charges"),
});

export const spells = pgTable("spells", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  school: spellSchool("school").notNull(),
  castingTime: text("casting_time").notNull(),
  range: text("range").notNull(),
  area: text("area"),
  targets: text("targets"),
  duration: text("duration").notNull(),
  savingThrow: text("saving_throw"),
  spellResist: text("spell_resist"),
  description: text("description").notNull(),
  damage: text("damage"),
  damageNote: text("damage_note"),
  source: text("source").notNull().default("CRB"),
});

export const spellClass = pgTable("spell_class", {
  spellId: uuid("spell_id").notNull().references(() => spells.id),
  classId: uuid("class_id").notNull().references(() => classes.id),
  spellLevel: integer("spell_level").notNull(),
}, (t) => [primaryKey({ columns: [t.spellId, t.classId] })]);

export const characterSpells = pgTable("character_spells", {
  id: uuid("id").primaryKey().defaultRandom(),
  characterId: uuid("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  spellId: uuid("spell_id").notNull().references(() => spells.id),
  spellLevel: integer("spell_level").notNull(),
});

export const classSpellProgression = pgTable("class_spell_progression", {
  classId: uuid("class_id").notNull().references(() => classes.id),
  characterLevel: integer("character_level").notNull(),
  spellLevel: integer("spell_level").notNull(),
  spellsKnown: integer("spells_known").notNull(),
  spellsPerDay: integer("spells_per_day").notNull().default(0),
}, (t) => [primaryKey({ columns: [t.classId, t.characterLevel, t.spellLevel] })]);

export const characterSpellSlots = pgTable("character_spell_slots", {
  characterId: uuid("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  spellLevel: integer("spell_level").notNull(),
  totalSlots: integer("total_slots").notNull().default(0),
  usedSlots: integer("used_slots").notNull().default(0),
}, (t) => [primaryKey({ columns: [t.characterId, t.spellLevel] })]);

export const classAbilities = pgTable("class_abilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  classId: uuid("class_id").notNull().references(() => classes.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  level: integer("level").notNull(),
  repeatable: boolean("repeatable").notNull().default(false),
  choicePool: text("choice_pool"),
  sourceBook: text("source_book").notNull().default("crb"),
});

export const classAbilityOptions = pgTable("class_ability_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  classId: uuid("class_id").notNull().references(() => classes.id),
  poolName: text("pool_name").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  prerequisites: text("prerequisites"),
  sourceBook: text("source_book").notNull().default("crb"),
});

export const themeAbilities = pgTable("theme_abilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  themeId: uuid("theme_id").notNull().references(() => themes.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  level: integer("level").notNull(),
  sourceBook: text("source_book").notNull().default("crb"),
});

export const feats = pgTable("feats", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  prerequisites: text("prerequisites"),
  isCombatFeat: boolean("is_combat_feat").notNull().default(false),
  sourceBook: text("source_book").notNull().default("crb"),
});

export const classWeaponProficiency = pgTable("class_weapon_proficiency", {
  classId: uuid("class_id").notNull().references(() => classes.id),
  weaponCategory: weaponCategory("weapon_category").notNull(),
}, (t) => [primaryKey({ columns: [t.classId, t.weaponCategory] })]);

export const characterClassChoices = pgTable("character_class_choices", {
  id: uuid("id").primaryKey().defaultRandom(),
  characterId: uuid("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  classAbilityId: uuid("class_ability_id").notNull().references(() => classAbilities.id),
  optionId: uuid("option_id").references(() => classAbilityOptions.id),
  customValue: text("custom_value"),
  acquiredAtLevel: integer("acquired_at_level").notNull(),
});

export const characterFeats = pgTable("character_feats", {
  id: uuid("id").primaryKey().defaultRandom(),
  characterId: uuid("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  featId: uuid("feat_id").references(() => feats.id),
  customName: text("custom_name"),
  notes: text("notes"),
});

export type Weapon = typeof weapons.$inferSelect;
export type NewWeapon = typeof weapons.$inferInsert;
export type WeaponCategory = typeof weaponCategory.enumValues[number];
export type CharacterWeapon = typeof characterWeapons.$inferSelect;
export type Armor = typeof armor.$inferSelect;
export type NewArmor = typeof armor.$inferInsert;
export type ArmorType = typeof armorType.enumValues[number];
export type CharacterArmor = typeof characterArmor.$inferSelect;
export type NewCharacterArmor = typeof characterArmor.$inferInsert;
export type ClassArmorProficiency = typeof classArmorProficiency.$inferSelect;
export type Chassis = typeof chassis.$inferSelect;
export type NewChassis = typeof chassis.$inferInsert;
export type RaceType = typeof raceType.enumValues[number];
export type Race = typeof races.$inferSelect;
export type NewRace = typeof races.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type Theme = typeof themes.$inferSelect;
export type NewTheme = typeof themes.$inferInsert;
export type RaceDescription = typeof raceDescriptions.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
export type CharacterDescription = typeof characterDescriptions.$inferSelect;
export type CharacterCombatStats = typeof characterCombatStats.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type ClassSkill = typeof classSkills.$inferSelect;
export type CharacterSkill = typeof characterSkills.$inferSelect;
export type NewCharacterSkill = typeof characterSkills.$inferInsert;
export type Equipment = typeof equipment.$inferSelect;
export type NewEquipment = typeof equipment.$inferInsert;
export type EquipmentCategory = typeof equipmentCategory.enumValues[number];
export type AugmentationSystem = typeof augmentationSystem.enumValues[number];
export type CharacterEquipment = typeof characterEquipment.$inferSelect;
export type NewCharacterEquipment = typeof characterEquipment.$inferInsert;
export type SpellSchool = typeof spellSchool.enumValues[number];
export type Spell = typeof spells.$inferSelect;
export type NewSpell = typeof spells.$inferInsert;
export type SpellClass = typeof spellClass.$inferSelect;
export type CharacterSpell = typeof characterSpells.$inferSelect;
export type NewCharacterSpell = typeof characterSpells.$inferInsert;
export type ClassSpellProgression = typeof classSpellProgression.$inferSelect;
export type CharacterSpellSlot = typeof characterSpellSlots.$inferSelect;
export type NewCharacterSpellSlot = typeof characterSpellSlots.$inferInsert;
export type ClassAbility = typeof classAbilities.$inferSelect;
export type NewClassAbility = typeof classAbilities.$inferInsert;
export type ClassAbilityOption = typeof classAbilityOptions.$inferSelect;
export type NewClassAbilityOption = typeof classAbilityOptions.$inferInsert;
export type ThemeAbility = typeof themeAbilities.$inferSelect;
export type NewThemeAbility = typeof themeAbilities.$inferInsert;
export type Feat = typeof feats.$inferSelect;
export type NewFeat = typeof feats.$inferInsert;
export type ClassWeaponProficiency = typeof classWeaponProficiency.$inferSelect;
export type CharacterClassChoice = typeof characterClassChoices.$inferSelect;
export type NewCharacterClassChoice = typeof characterClassChoices.$inferInsert;
export type CharacterFeat = typeof characterFeats.$inferSelect;
export type NewCharacterFeat = typeof characterFeats.$inferInsert;
export type Spaceship = typeof spaceships.$inferSelect;
export type NewSpaceship = typeof spaceships.$inferInsert;
export type SpaceshipWeapon = typeof spaceshipWeapons.$inferSelect;
export type NewSpaceshipWeapon = typeof spaceshipWeapons.$inferInsert;
export type SpaceshipNote = typeof spaceshipNotes.$inferSelect;
export type NewSpaceshipNote = typeof spaceshipNotes.$inferInsert;
export type SpaceshipCrew = typeof spaceshipCrew.$inferSelect;
export type NewSpaceshipCrew = typeof spaceshipCrew.$inferInsert;
export type CrewRole = "captain" | "pilot" | "engineer" | "gunner" | "science_officer";
