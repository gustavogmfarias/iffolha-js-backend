/*
  Warnings:

  - The values [CURSO] on the enum `LogRepository` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LogRepository_new" AS ENUM ('TAG', 'COURSE', 'CLASS', 'CATEGORY', 'TEXTUALGENRE', 'USER', 'USERTOKEN', 'LOG', 'ARTICLE');
ALTER TABLE "logs" ALTER COLUMN "logRepository" TYPE "LogRepository_new" USING ("logRepository"::text::"LogRepository_new");
ALTER TYPE "LogRepository" RENAME TO "LogRepository_old";
ALTER TYPE "LogRepository_new" RENAME TO "LogRepository";
DROP TYPE "LogRepository_old";
COMMIT;
