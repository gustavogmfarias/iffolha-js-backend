-- CreateTable
CREATE TABLE "Article" (
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

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorsOnArticles" (
    "ArticleId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "AuthorsOnArticles_pkey" PRIMARY KEY ("ArticleId","authorId")
);

-- CreateTable
CREATE TABLE "ArticleImages" (
    "id" TEXT NOT NULL,
    "ArticleId" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "ArticleImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_publishedByUserId_fkey" FOREIGN KEY ("publishedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_editedByUserId_fkey" FOREIGN KEY ("editedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorsOnArticles" ADD CONSTRAINT "AuthorsOnArticles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorsOnArticles" ADD CONSTRAINT "AuthorsOnArticles_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImages" ADD CONSTRAINT "ArticleImages_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
