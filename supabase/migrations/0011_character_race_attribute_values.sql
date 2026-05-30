CREATE TABLE "character_race_attribute_values" (
	"character_id" uuid NOT NULL,
	"attribute_id" uuid NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	CONSTRAINT "character_race_attribute_values_pk" PRIMARY KEY("character_id","attribute_id")
);
--> statement-breakpoint
ALTER TABLE "character_race_attribute_values" ADD CONSTRAINT "character_race_attribute_values_character_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "character_race_attribute_values" ADD CONSTRAINT "character_race_attribute_values_attribute_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."race_attributes"("id") ON DELETE cascade ON UPDATE no action;
