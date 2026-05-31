-- Rename the enum value
ALTER TYPE "public"."race_type" RENAME VALUE 'android' TO 'droid';

-- Android (the playable race) is biological — update its type
UPDATE "races" SET "type" = 'biological' WHERE "name" = 'Android';

-- race_descriptions that were android-specific are now under biological
UPDATE "race_descriptions" SET "race_type" = 'biological' WHERE "race_type" = 'droid';

-- Add the Droid race entry
INSERT INTO "races" ("id", "name", "type") VALUES (gen_random_uuid(), 'Droid', 'droid');
