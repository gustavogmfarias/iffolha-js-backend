/*
  Warnings:

  - You are about to drop the `Articles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleImages" DROP CONSTRAINT "ArticleImages_ArticleId_fkey";

-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_editedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_publishedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "AuthorsOnArticles" DROP CONSTRAINT "AuthorsOnArticles_ArticleId_fkey";

-- DropTable
DROP TABLE "Articles";

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mainImage" TEXT,
    "publishedByUserId" TEXT NOT NULL,
    "editedByUserId" TEXT,
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "updatedDate" TIMESTAMP(3),
    "isHighlight" BOOLEAN NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_publishedByUserId_fkey" FOREIGN KEY ("publishedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_editedByUserId_fkey" FOREIGN KEY ("editedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorsOnArticles" ADD CONSTRAINT "AuthorsOnArticles_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImages" ADD CONSTRAINT "ArticleImages_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
