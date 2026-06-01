CREATE TABLE "class_abilities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "class_id" uuid NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "level" integer NOT NULL,
  "repeatable" boolean NOT NULL DEFAULT false,
  "choice_pool" text,
  "source_book" text NOT NULL DEFAULT 'crb'
);
--> statement-breakpoint
CREATE TABLE "class_ability_options" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "class_id" uuid NOT NULL,
  "pool_name" text NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "prerequisites" text,
  "source_book" text NOT NULL DEFAULT 'crb'
);
--> statement-breakpoint
CREATE TABLE "theme_abilities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "theme_id" uuid NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "level" integer NOT NULL,
  "source_book" text NOT NULL DEFAULT 'crb'
);
--> statement-breakpoint
CREATE TABLE "feats" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL UNIQUE,
  "description" text NOT NULL,
  "prerequisites" text,
  "is_combat_feat" boolean NOT NULL DEFAULT false,
  "source_book" text NOT NULL DEFAULT 'crb'
);
--> statement-breakpoint
CREATE TABLE "class_weapon_proficiency" (
  "class_id" uuid NOT NULL,
  "weapon_category" weapon_category NOT NULL,
  PRIMARY KEY ("class_id", "weapon_category")
);
--> statement-breakpoint
CREATE TABLE "character_class_choices" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "character_id" uuid NOT NULL,
  "class_ability_id" uuid NOT NULL,
  "option_id" uuid,
  "custom_value" text,
  "acquired_at_level" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_feats" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "character_id" uuid NOT NULL,
  "feat_id" uuid,
  "custom_name" text,
  "notes" text
);
--> statement-breakpoint
ALTER TABLE "class_abilities" ADD CONSTRAINT "class_abilities_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "class_ability_options" ADD CONSTRAINT "class_ability_options_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "theme_abilities" ADD CONSTRAINT "theme_abilities_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "class_weapon_proficiency" ADD CONSTRAINT "class_weapon_proficiency_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "character_class_choices" ADD CONSTRAINT "character_class_choices_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "character_class_choices" ADD CONSTRAINT "character_class_choices_class_ability_id_fk" FOREIGN KEY ("class_ability_id") REFERENCES "public"."class_abilities"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "character_class_choices" ADD CONSTRAINT "character_class_choices_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."class_ability_options"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "character_feats" ADD CONSTRAINT "character_feats_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "character_feats" ADD CONSTRAINT "character_feats_feat_id_feats_id_fk" FOREIGN KEY ("feat_id") REFERENCES "public"."feats"("id") ON DELETE set null ON UPDATE no action;
