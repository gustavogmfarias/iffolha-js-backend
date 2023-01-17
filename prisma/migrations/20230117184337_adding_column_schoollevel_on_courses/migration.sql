/*
  Warnings:

  - You are about to drop the column `level` on the `courses` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SchoolLevel" AS ENUM ('SUPERIOR', 'TECNICO', 'ENSINO_MEDIO');

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_courseId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "level",
ADD COLUMN     "schoolLevel" "SchoolLevel" NOT NULL DEFAULT 'SUPERIOR';

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
