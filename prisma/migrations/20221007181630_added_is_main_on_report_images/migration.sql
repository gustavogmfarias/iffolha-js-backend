/*
  Warnings:

  - Added the required column `isMain` to the `ArticleImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticleImages" ADD COLUMN     "isMain" BOOLEAN NOT NULL;
