-- DropForeignKey
ALTER TABLE "AuthorsOnArticles" DROP CONSTRAINT "AuthorsOnArticles_authorId_fkey";

-- AddForeignKey
ALTER TABLE "AuthorsOnArticles" ADD CONSTRAINT "AuthorsOnArticles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
