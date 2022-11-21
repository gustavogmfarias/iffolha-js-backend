/*
  Warnings:

  - You are about to drop the column `articlesId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the `_ArticleToCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArticleToCategory" DROP CONSTRAINT "_ArticleToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToCategory" DROP CONSTRAINT "_ArticleToCategory_B_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "articlesId",
ADD COLUMN     "articleId" TEXT;

-- DropTable
DROP TABLE "_ArticleToCategory";

-- CreateTable
CREATE TABLE "CategoryOnArticles" (
    "articleId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CategoryOnArticles_pkey" PRIMARY KEY ("categoryId","articleId")
);

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnArticles" ADD CONSTRAINT "CategoryOnArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnArticles" ADD CONSTRAINT "CategoryOnArticles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
