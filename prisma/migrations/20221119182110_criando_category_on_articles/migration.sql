/*
  Warnings:

  - You are about to drop the column `articleId` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_articleId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "articleId";
