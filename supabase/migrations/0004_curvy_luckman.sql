CREATE TABLE "class_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"input_type" text NOT NULL,
	"description" text,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "race_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"race_id" uuid NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"input_type" text NOT NULL,
	"description" text,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theme_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"theme_id" uuid NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"input_type" text NOT NULL,
	"description" text,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_attributes" ADD CONSTRAINT "class_attributes_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_attributes" ADD CONSTRAINT "race_attributes_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_attributes" ADD CONSTRAINT "theme_attributes_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
-- race_attributes seed data
-- Android (a1000000-0000-0000-0000-000000000001)
INSERT INTO "race_attributes" ("id", "race_id", "type", "name", "input_type", "sort_order") VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'movement', 'Land Speed', 'text', 1),
  ('d0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'sense', 'Darkvision', 'text', 1),
  ('d0000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'sense', 'Low-light Vision', 'boolean', 2),
  ('d0000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'trait', 'Constructed', 'boolean', 1),
  ('d0000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'trait', 'Flat Affect', 'boolean', 2),
  ('d0000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'trait', 'Upgrade Slot', 'text', 3),
  ('d0000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 'trait', 'Weakness: Electricity', 'boolean', 4);

-- Human (a1000000-0000-0000-0000-000000000002)
INSERT INTO "race_attributes" ("id", "race_id", "type", "name", "input_type", "sort_order") VALUES
  ('d0000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', 'movement', 'Land Speed', 'text', 1),
  ('d0000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000002', 'trait', 'Bonus Feat', 'text', 1),
  ('d0000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000002', 'trait', 'Skilled', 'boolean', 2);

-- Kasatha (a1000000-0000-0000-0000-000000000003)
INSERT INTO "race_attributes" ("id", "race_id", "type", "name", "input_type", "sort_order") VALUES
  ('d0000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000003', 'movement', 'Land Speed', 'text', 1),
  ('d0000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000003', 'sense', 'Darkvision', 'text', 1),
  ('d0000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000003', 'trait', 'Desert Stride', 'boolean', 1),
  ('d0000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000003', 'trait', 'Four-Armed', 'boolean', 2),
  ('d0000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000003', 'trait', 'Historian', 'boolean', 3),
  ('d0000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000003', 'trait', 'Natural Grace', 'boolean', 4),
  ('d0000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000003', 'trait', 'Weapon Familiarity', 'boolean', 5);

-- Lashunta (Damaya) (a1000000-0000-0000-0000-000000000004)
INSERT INTO "race_attributes" ("id", "race_id", "type", "name", "input_type", "sort_order") VALUES
  ('d0000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000004', 'movement', 'Land Speed', 'text', 1),
  ('d0000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000004', 'trait', 'Lashunta Magic', 'text', 1),
  ('d0000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000004', 'trait', 'Limited Telepathy', 'text', 2),
  ('d0000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000004', 'trait', 'Student', 'text', 3);

-- Lashunta (Korasha) (a1000000-0000-0000-0000-000000000005)
INSERT INTO "race_attributes" ("id", "race_id", "type", "name", "input_type", "sort_order") VALUES
  ('d0000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000005', 'movement', 'Land Speed', 'text', 1),
  ('d0000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000005', 'trait', 'Lashunta Magic', 'text', 1),
  ('d0000000-0000-0000-0000-000000000024', 'a1000000-0000-0000-0000-000000000005', 'trait', 'Limited Telepathy', 'text', 2),
  ('d0000000-0000-0000-0000-000000000025', 'a1000000-0000-0000-0000-000000000005', 'trait', 'Student', 'text', 3);

-- Shirren (a1000000-0000-0000-0000-000000000006)
INSERT INTO "race_attributes" ("id", "race_id", "type", "name", "input_type", "sort_order") VALUES
  ('d0000000-0000-0000-0000-000000000026', 'a1000000-0000-0000-0000-000000000006', 'movement', 'Land Speed', 'text', 1),
  ('d0000000-0000-0000-0000-000000000027', 'a1000000-0000-0000-0000-000000000006', 'sense', 'Blindsense (Vibration)', 'text', 1),
  ('d0000000-0000-0000-0000-000000000028', 'a1000000-0000-0000-0000-000000000006', 'trait', 'Communalism', 'boolean', 1),
  ('d0000000-0000-0000-0000-000000000029', 'a1000000-0000-0000-0000-000000000006', 'trait', 'Cultural Fascination', 'boolean', 2),
  ('d0000000-0000-0000-0000-000000000030', 'a1000000-0000-0000-0000-000000000006', 'trait', 'Limited Telepathy', 'text', 3);

-- Vesk (a1000000-0000-0000-0000-000000000007)
INSERT INTO "race_attributes" ("id", "race_id", "type", "name", "input_type", "sort_order") VALUES
  ('d0000000-0000-0000-0000-000000000031', 'a1000000-0000-0000-0000-000000000007', 'movement', 'Land Speed', 'text', 1),
  ('d0000000-0000-0000-0000-000000000032', 'a1000000-0000-0000-0000-000000000007', 'sense', 'Low-light Vision', 'boolean', 1),
  ('d0000000-0000-0000-0000-000000000033', 'a1000000-0000-0000-0000-000000000007', 'trait', 'Armor Savant', 'boolean', 1),
  ('d0000000-0000-0000-0000-000000000034', 'a1000000-0000-0000-0000-000000000007', 'trait', 'Fearless', 'boolean', 2),
  ('d0000000-0000-0000-0000-000000000035', 'a1000000-0000-0000-0000-000000000007', 'trait', 'Natural Weapons', 'text', 3),
  ('d0000000-0000-0000-0000-000000000036', 'a1000000-0000-0000-0000-000000000007', 'trait', 'Weapon Familiarity', 'boolean', 4);

-- Ysoki (a1000000-0000-0000-0000-000000000008)
INSERT INTO "race_attributes" ("id", "race_id", "type", "name", "input_type", "sort_order") VALUES
  ('d0000000-0000-0000-0000-000000000037', 'a1000000-0000-0000-0000-000000000008', 'movement', 'Land Speed', 'text', 1),
  ('d0000000-0000-0000-0000-000000000038', 'a1000000-0000-0000-0000-000000000008', 'sense', 'Darkvision', 'text', 1),
  ('d0000000-0000-0000-0000-000000000039', 'a1000000-0000-0000-0000-000000000008', 'trait', 'Cheek Pouches', 'text', 1),
  ('d0000000-0000-0000-0000-000000000040', 'a1000000-0000-0000-0000-000000000008', 'trait', 'Moxie', 'boolean', 2),
  ('d0000000-0000-0000-0000-000000000041', 'a1000000-0000-0000-0000-000000000008', 'trait', 'Scrounger', 'boolean', 3),
  ('d0000000-0000-0000-0000-000000000042', 'a1000000-0000-0000-0000-000000000008', 'trait', 'Tinker', 'boolean', 4);

--> statement-breakpoint
-- class_attributes seed data
-- Envoy (b1000000-0000-0000-0000-000000000001)
INSERT INTO "class_attributes" ("id", "class_id", "type", "name", "input_type", "sort_order") VALUES
  ('e0000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'proficiency', 'Light Armor', 'boolean', 1),
  ('e0000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'proficiency', 'Basic Melee Weapons', 'boolean', 2),
  ('e0000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'proficiency', 'Grenades', 'boolean', 3),
  ('e0000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'proficiency', 'Small Arms', 'boolean', 4),
  ('e0000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'feature', 'Expertise (Skills)', 'text', 1),
  ('e0000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 'feature', 'Improvisations', 'text', 2),
  ('e0000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', 'feature', 'Expertise Talent', 'text', 3),
  ('e0000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000001', 'feature', 'Skill Expertise', 'text', 4);

-- Mechanic (b1000000-0000-0000-0000-000000000002)
INSERT INTO "class_attributes" ("id", "class_id", "type", "name", "input_type", "sort_order") VALUES
  ('e0000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000002', 'proficiency', 'Light Armor', 'boolean', 1),
  ('e0000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000002', 'proficiency', 'Basic Melee Weapons', 'boolean', 2),
  ('e0000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000002', 'proficiency', 'Small Arms', 'boolean', 3),
  ('e0000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000002', 'feature', 'Artificial Intelligence', 'text', 1),
  ('e0000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000002', 'feature', 'Mechanic Trick', 'text', 2),
  ('e0000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000002', 'feature', 'Remote Hack', 'boolean', 3),
  ('e0000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000002', 'feature', 'Bypass', 'boolean', 4),
  ('e0000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000002', 'feature', 'Override', 'boolean', 5);

-- Mystic (b1000000-0000-0000-0000-000000000003)
INSERT INTO "class_attributes" ("id", "class_id", "type", "name", "input_type", "sort_order") VALUES
  ('e0000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000003', 'proficiency', 'Light Armor', 'boolean', 1),
  ('e0000000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000003', 'proficiency', 'Basic Melee Weapons', 'boolean', 2),
  ('e0000000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000003', 'proficiency', 'Small Arms', 'boolean', 3),
  ('e0000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000003', 'feature', 'Connection', 'text', 1),
  ('e0000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000003', 'feature', 'Spells Known', 'text', 2),
  ('e0000000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000003', 'feature', 'Connection Power', 'text', 3),
  ('e0000000-0000-0000-0000-000000000023', 'b1000000-0000-0000-0000-000000000003', 'feature', 'Channel Skill', 'text', 4),
  ('e0000000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000003', 'feature', 'Mindlink', 'boolean', 5);

-- Operative (b1000000-0000-0000-0000-000000000004)
INSERT INTO "class_attributes" ("id", "class_id", "type", "name", "input_type", "sort_order") VALUES
  ('e0000000-0000-0000-0000-000000000025', 'b1000000-0000-0000-0000-000000000004', 'proficiency', 'Light Armor', 'boolean', 1),
  ('e0000000-0000-0000-0000-000000000026', 'b1000000-0000-0000-0000-000000000004', 'proficiency', 'Basic Melee Weapons', 'boolean', 2),
  ('e0000000-0000-0000-0000-000000000027', 'b1000000-0000-0000-0000-000000000004', 'proficiency', 'Small Arms', 'boolean', 3),
  ('e0000000-0000-0000-0000-000000000028', 'b1000000-0000-0000-0000-000000000004', 'proficiency', 'Sniper Weapons', 'boolean', 4),
  ('e0000000-0000-0000-0000-000000000029', 'b1000000-0000-0000-0000-000000000004', 'feature', 'Specialization', 'text', 1),
  ('e0000000-0000-0000-0000-000000000030', 'b1000000-0000-0000-0000-000000000004', 'feature', 'Trick Attack', 'boolean', 2),
  ('e0000000-0000-0000-0000-000000000031', 'b1000000-0000-0000-0000-000000000004', 'feature', 'Operative Exploits', 'text', 3),
  ('e0000000-0000-0000-0000-000000000032', 'b1000000-0000-0000-0000-000000000004', 'feature', 'Debilitating Trick', 'text', 4),
  ('e0000000-0000-0000-0000-000000000033', 'b1000000-0000-0000-0000-000000000004', 'feature', 'Quick Movement', 'boolean', 5);

-- Solarian (b1000000-0000-0000-0000-000000000005)
INSERT INTO "class_attributes" ("id", "class_id", "type", "name", "input_type", "sort_order") VALUES
  ('e0000000-0000-0000-0000-000000000034', 'b1000000-0000-0000-0000-000000000005', 'proficiency', 'Light Armor', 'boolean', 1),
  ('e0000000-0000-0000-0000-000000000035', 'b1000000-0000-0000-0000-000000000005', 'proficiency', 'Advanced Melee Weapons', 'boolean', 2),
  ('e0000000-0000-0000-0000-000000000036', 'b1000000-0000-0000-0000-000000000005', 'proficiency', 'Basic Melee Weapons', 'boolean', 3),
  ('e0000000-0000-0000-0000-000000000037', 'b1000000-0000-0000-0000-000000000005', 'proficiency', 'Small Arms', 'boolean', 4),
  ('e0000000-0000-0000-0000-000000000038', 'b1000000-0000-0000-0000-000000000005', 'feature', 'Stellar Mode', 'boolean', 1),
  ('e0000000-0000-0000-0000-000000000039', 'b1000000-0000-0000-0000-000000000005', 'feature', 'Solar Manifestation', 'text', 2),
  ('e0000000-0000-0000-0000-000000000040', 'b1000000-0000-0000-0000-000000000005', 'feature', 'Stellar Revelations', 'text', 3),
  ('e0000000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000005', 'feature', 'Zenith Revelations', 'text', 4),
  ('e0000000-0000-0000-0000-000000000042', 'b1000000-0000-0000-0000-000000000005', 'feature', 'Sidereal Influence', 'text', 5);

-- Soldier (b1000000-0000-0000-0000-000000000006)
INSERT INTO "class_attributes" ("id", "class_id", "type", "name", "input_type", "sort_order") VALUES
  ('e0000000-0000-0000-0000-000000000043', 'b1000000-0000-0000-0000-000000000006', 'proficiency', 'Light Armor', 'boolean', 1),
  ('e0000000-0000-0000-0000-000000000044', 'b1000000-0000-0000-0000-000000000006', 'proficiency', 'Heavy Armor', 'boolean', 2),
  ('e0000000-0000-0000-0000-000000000045', 'b1000000-0000-0000-0000-000000000006', 'proficiency', 'Advanced Melee Weapons', 'boolean', 3),
  ('e0000000-0000-0000-0000-000000000046', 'b1000000-0000-0000-0000-000000000006', 'proficiency', 'Basic Melee Weapons', 'boolean', 4),
  ('e0000000-0000-0000-0000-000000000047', 'b1000000-0000-0000-0000-000000000006', 'proficiency', 'Small Arms', 'boolean', 5),
  ('e0000000-0000-0000-0000-000000000048', 'b1000000-0000-0000-0000-000000000006', 'proficiency', 'Long Arms', 'boolean', 6),
  ('e0000000-0000-0000-0000-000000000049', 'b1000000-0000-0000-0000-000000000006', 'proficiency', 'Heavy Weapons', 'boolean', 7),
  ('e0000000-0000-0000-0000-000000000050', 'b1000000-0000-0000-0000-000000000006', 'proficiency', 'Sniper Weapons', 'boolean', 8),
  ('e0000000-0000-0000-0000-000000000051', 'b1000000-0000-0000-0000-000000000006', 'proficiency', 'Grenades', 'boolean', 9),
  ('e0000000-0000-0000-0000-000000000052', 'b1000000-0000-0000-0000-000000000006', 'feature', 'Fighting Style', 'text', 1),
  ('e0000000-0000-0000-0000-000000000053', 'b1000000-0000-0000-0000-000000000006', 'feature', 'Gear Boost', 'text', 2),
  ('e0000000-0000-0000-0000-000000000054', 'b1000000-0000-0000-0000-000000000006', 'feature', 'Bonus Feats', 'text', 3),
  ('e0000000-0000-0000-0000-000000000055', 'b1000000-0000-0000-0000-000000000006', 'feature', 'Weapon Specialization', 'boolean', 4);

-- Technomancer (b1000000-0000-0000-0000-000000000007)
INSERT INTO "class_attributes" ("id", "class_id", "type", "name", "input_type", "sort_order") VALUES
  ('e0000000-0000-0000-0000-000000000056', 'b1000000-0000-0000-0000-000000000007', 'proficiency', 'Light Armor', 'boolean', 1),
  ('e0000000-0000-0000-0000-000000000057', 'b1000000-0000-0000-0000-000000000007', 'proficiency', 'Basic Melee Weapons', 'boolean', 2),
  ('e0000000-0000-0000-0000-000000000058', 'b1000000-0000-0000-0000-000000000007', 'proficiency', 'Small Arms', 'boolean', 3),
  ('e0000000-0000-0000-0000-000000000059', 'b1000000-0000-0000-0000-000000000007', 'feature', 'Spells Known', 'text', 1),
  ('e0000000-0000-0000-0000-000000000060', 'b1000000-0000-0000-0000-000000000007', 'feature', 'Spell Cache', 'text', 2),
  ('e0000000-0000-0000-0000-000000000061', 'b1000000-0000-0000-0000-000000000007', 'feature', 'Magic Hack', 'text', 3),
  ('e0000000-0000-0000-0000-000000000062', 'b1000000-0000-0000-0000-000000000007', 'feature', 'Cache Capacitor', 'text', 4),
  ('e0000000-0000-0000-0000-000000000063', 'b1000000-0000-0000-0000-000000000007', 'feature', 'Techlore', 'boolean', 5);

--> statement-breakpoint
-- theme_attributes seed data
INSERT INTO "theme_attributes" ("id", "theme_id", "type", "name", "input_type", "sort_order") VALUES
  -- Ace Pilot (c1000000-0000-0000-0000-000000000001)
  ('f0000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'feature', 'Theme Knowledge', 'text', 1),
  ('f0000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'feature', 'Lone Wolf', 'text', 2),
  ('f0000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'feature', 'Master Pilot', 'text', 3),
  -- Bounty Hunter (c1000000-0000-0000-0000-000000000002)
  ('f0000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'feature', 'Theme Knowledge', 'text', 1),
  ('f0000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'feature', 'Hunter''s Determination', 'text', 2),
  ('f0000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'feature', 'Master Tracker', 'text', 3),
  -- Icon (c1000000-0000-0000-0000-000000000003)
  ('f0000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000003', 'feature', 'Theme Knowledge', 'text', 1),
  ('f0000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'feature', 'Celebrity', 'text', 2),
  ('f0000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000003', 'feature', 'Master Celebrity', 'text', 3),
  -- Mercenary (c1000000-0000-0000-0000-000000000004)
  ('f0000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000004', 'feature', 'Theme Knowledge', 'text', 1),
  ('f0000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000004', 'feature', 'Team Tactics', 'text', 2),
  ('f0000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000004', 'feature', 'Superior Tactics', 'text', 3),
  -- Outlaw (c1000000-0000-0000-0000-000000000005)
  ('f0000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000005', 'feature', 'Theme Knowledge', 'text', 1),
  ('f0000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000005', 'feature', 'Danger Sense', 'text', 2),
  ('f0000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000005', 'feature', 'Black Market Connections', 'text', 3),
  -- Priest (c1000000-0000-0000-0000-000000000006)
  ('f0000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000006', 'feature', 'Theme Knowledge', 'text', 1),
  ('f0000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000006', 'feature', 'Divine Boon', 'text', 2),
  ('f0000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000006', 'feature', 'Divine Locus', 'text', 3),
  -- Scholar (c1000000-0000-0000-0000-000000000007)
  ('f0000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000007', 'feature', 'Theme Knowledge', 'text', 1),
  ('f0000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000007', 'feature', 'Research (6th Level)', 'text', 2),
  ('f0000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000007', 'feature', 'Scientific Paragon', 'text', 3),
  -- Spacefarer (c1000000-0000-0000-0000-000000000008)
  ('f0000000-0000-0000-0000-000000000022', 'c1000000-0000-0000-0000-000000000008', 'feature', 'Theme Knowledge', 'text', 1),
  ('f0000000-0000-0000-0000-000000000023', 'c1000000-0000-0000-0000-000000000008', 'feature', 'Eager Dabbler', 'text', 2),
  ('f0000000-0000-0000-0000-000000000024', 'c1000000-0000-0000-0000-000000000008', 'feature', 'Master Explorer', 'text', 3),
  -- Street Rat (c1000000-0000-0000-0000-000000000009)
  ('f0000000-0000-0000-0000-000000000025', 'c1000000-0000-0000-0000-000000000009', 'feature', 'Theme Knowledge', 'text', 1),
  ('f0000000-0000-0000-0000-000000000026', 'c1000000-0000-0000-0000-000000000009', 'feature', 'Draw Fire', 'text', 2),
  ('f0000000-0000-0000-0000-000000000027', 'c1000000-0000-0000-0000-000000000009', 'feature', 'Skulk', 'text', 3),
  -- Themeless (c1000000-0000-0000-0000-000000000010)
  ('f0000000-0000-0000-0000-000000000028', 'c1000000-0000-0000-0000-000000000010', 'feature', 'Former Life', 'text', 1),
  ('f0000000-0000-0000-0000-000000000029', 'c1000000-0000-0000-0000-000000000010', 'feature', 'Nothing to Prove', 'text', 2),
  ('f0000000-0000-0000-0000-000000000030', 'c1000000-0000-0000-0000-000000000010', 'feature', 'Themeless Boon', 'text', 3);