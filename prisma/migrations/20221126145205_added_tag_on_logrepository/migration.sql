-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LogRepository" ADD VALUE 'TAG';
ALTER TYPE "LogRepository" ADD VALUE 'CURSO';
ALTER TYPE "LogRepository" ADD VALUE 'CLASS';
ALTER TYPE "LogRepository" ADD VALUE 'CATEGORY';
ALTER TYPE "LogRepository" ADD VALUE 'TEXTUALGENRE';
