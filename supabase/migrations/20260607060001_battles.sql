CREATE TYPE "battle_status" AS ENUM ('setup', 'active');
CREATE TYPE "combatant_type" AS ENUM ('pc', 'enemy');

CREATE TABLE IF NOT EXISTS "battles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "campaign_id" uuid NOT NULL REFERENCES "campaigns"("id") ON DELETE CASCADE,
  "status" battle_status NOT NULL DEFAULT 'setup',
  "current_round" integer NOT NULL DEFAULT 1,
  "current_turn_index" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "battle_combatants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "battle_id" uuid NOT NULL REFERENCES "battles"("id") ON DELETE CASCADE,
  "type" combatant_type NOT NULL,
  "character_id" uuid REFERENCES "characters"("id") ON DELETE SET NULL,
  "display_name" text NOT NULL,
  "initiative_total" integer,
  "hidden" boolean NOT NULL DEFAULT false,
  "defeated" boolean NOT NULL DEFAULT false,
  "sort_order" integer,
  "hp_total" integer,
  "hp_current" integer,
  "eac" integer,
  "kac" integer
);

ALTER PUBLICATION supabase_realtime ADD TABLE battles;
ALTER PUBLICATION supabase_realtime ADD TABLE battle_combatants;
