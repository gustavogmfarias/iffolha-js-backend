/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthorsOnArticles" DROP CONSTRAINT "AuthorsOnArticles_ArticleId_fkey";

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_editedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_publishedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleImages" DROP CONSTRAINT "ArticleImages_ArticleId_fkey";

-- AlterTable
ALTER TABLE "ArticleImages" ALTER COLUMN "isMain" SET DEFAULT false;

-- DropTable
DROP TABLE "Article";

-- CreateTable
CREATE TABLE "Articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "publishedByUserId" TEXT NOT NULL,
    "editedByUserId" TEXT NOT NULL,
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "isHighlight" BOOLEAN NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_publishedByUserId_fkey" FOREIGN KEY ("publishedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_editedByUserId_fkey" FOREIGN KEY ("editedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorsOnArticles" ADD CONSTRAINT "AuthorsOnArticles_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImages" ADD CONSTRAINT "ArticleImages_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
