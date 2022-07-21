/*
  Warnings:

  - Changed the type of `repository` on the `logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LogRepository" AS ENUM ('USERSREPOSITORY');

-- AlterTable
ALTER TABLE "logs" DROP COLUMN "repository",
ADD COLUMN     "repository" "LogRepository" NOT NULL;

-- DropEnum
DROP TYPE "Repository";
