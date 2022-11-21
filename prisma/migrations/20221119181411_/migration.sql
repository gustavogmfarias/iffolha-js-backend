/*
  Warnings:

  - You are about to drop the column `articleId` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "articleId",
ADD COLUMN     "articlesId" TEXT[];
