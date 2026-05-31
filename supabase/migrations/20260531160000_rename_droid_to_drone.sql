ALTER TYPE "public"."race_type" RENAME VALUE 'droid' TO 'drone';

UPDATE "races" SET "name" = 'Drone' WHERE "name" = 'Droid';
