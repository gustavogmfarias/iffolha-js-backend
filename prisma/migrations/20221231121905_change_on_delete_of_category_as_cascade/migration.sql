-- DropForeignKey
ALTER TABLE "CategoryOnArticles" DROP CONSTRAINT "CategoryOnArticles_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "CategoryOnArticles" ADD CONSTRAINT "CategoryOnArticles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
