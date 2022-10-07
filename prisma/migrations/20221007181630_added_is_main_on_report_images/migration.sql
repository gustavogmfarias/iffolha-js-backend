/*
  Warnings:

  - Added the required column `isMain` to the `ReportImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportImages" ADD COLUMN     "isMain" BOOLEAN NOT NULL;
