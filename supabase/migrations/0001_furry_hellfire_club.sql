CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"source" text DEFAULT 'CRB' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "races" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"source" text DEFAULT 'CRB' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"source" text DEFAULT 'CRB' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "race_id" uuid;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "class_id" uuid;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "theme_id" uuid;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
INSERT INTO "races" ("id", "name", "source") VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Android', 'CRB'),
  ('a1000000-0000-0000-0000-000000000002', 'Human', 'CRB'),
  ('a1000000-0000-0000-0000-000000000003', 'Kasatha', 'CRB'),
  ('a1000000-0000-0000-0000-000000000004', 'Lashunta (Damaya)', 'CRB'),
  ('a1000000-0000-0000-0000-000000000005', 'Lashunta (Korasha)', 'CRB'),
  ('a1000000-0000-0000-0000-000000000006', 'Shirren', 'CRB'),
  ('a1000000-0000-0000-0000-000000000007', 'Vesk', 'CRB'),
  ('a1000000-0000-0000-0000-000000000008', 'Ysoki', 'CRB');

--> statement-breakpoint
INSERT INTO "classes" ("id", "name", "source") VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Envoy', 'CRB'),
  ('b1000000-0000-0000-0000-000000000002', 'Mechanic', 'CRB'),
  ('b1000000-0000-0000-0000-000000000003', 'Mystic', 'CRB'),
  ('b1000000-0000-0000-0000-000000000004', 'Operative', 'CRB'),
  ('b1000000-0000-0000-0000-000000000005', 'Solarian', 'CRB'),
  ('b1000000-0000-0000-0000-000000000006', 'Soldier', 'CRB'),
  ('b1000000-0000-0000-0000-000000000007', 'Technomancer', 'CRB');

--> statement-breakpoint
INSERT INTO "themes" ("id", "name", "source") VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Ace Pilot', 'CRB'),
  ('c1000000-0000-0000-0000-000000000002', 'Bounty Hunter', 'CRB'),
  ('c1000000-0000-0000-0000-000000000003', 'Icon', 'CRB'),
  ('c1000000-0000-0000-0000-000000000004', 'Mercenary', 'CRB'),
  ('c1000000-0000-0000-0000-000000000005', 'Outlaw', 'CRB'),
  ('c1000000-0000-0000-0000-000000000006', 'Priest', 'CRB'),
  ('c1000000-0000-0000-0000-000000000007', 'Scholar', 'CRB'),
  ('c1000000-0000-0000-0000-000000000008', 'Spacefarer', 'CRB'),
  ('c1000000-0000-0000-0000-000000000009', 'Street Rat', 'CRB'),
  ('c1000000-0000-0000-0000-000000000010', 'Themeless', 'CRB');