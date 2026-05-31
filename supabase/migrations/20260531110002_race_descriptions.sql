CREATE TABLE "race_descriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "race_type" "race_type" NOT NULL,
  "name" text NOT NULL,
  "sort_order" integer NOT NULL
);
