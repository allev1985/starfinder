CREATE TYPE "public"."race_type" AS ENUM ('biological', 'android');

ALTER TABLE "races" ADD COLUMN "type" "race_type";

UPDATE "races" SET "type" = 'android'  WHERE "id" = 'a1000000-0000-0000-0000-000000000001';
UPDATE "races" SET "type" = 'biological' WHERE "id" != 'a1000000-0000-0000-0000-000000000001';

ALTER TABLE "races" ALTER COLUMN "type" SET NOT NULL;
