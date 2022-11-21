-- DropForeignKey
ALTER TABLE "ArticleImages" DROP CONSTRAINT "ArticleImages_ArticleId_fkey";

-- DropForeignKey
ALTER TABLE "AuthorsOnArticles" DROP CONSTRAINT "AuthorsOnArticles_ArticleId_fkey";

-- DropForeignKey
ALTER TABLE "ClassOnArticles" DROP CONSTRAINT "ClassOnArticles_articleId_fkey";

-- DropForeignKey
ALTER TABLE "CoursesOnArticles" DROP CONSTRAINT "CoursesOnArticles_articleId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnArticles" DROP CONSTRAINT "TagsOnArticles_articleId_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_publishedByUserId_fkey";

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_publishedByUserId_fkey" FOREIGN KEY ("publishedByUserId") REFERENCES "users"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorsOnArticles" ADD CONSTRAINT "AuthorsOnArticles_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImages" ADD CONSTRAINT "ArticleImages_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnArticles" ADD CONSTRAINT "TagsOnArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursesOnArticles" ADD CONSTRAINT "CoursesOnArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOnArticles" ADD CONSTRAINT "ClassOnArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
