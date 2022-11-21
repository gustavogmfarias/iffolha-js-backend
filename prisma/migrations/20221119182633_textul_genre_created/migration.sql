-- CreateTable
CREATE TABLE "textualgenres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "textualgenres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextualGenreOnArticles" (
    "articleId" TEXT NOT NULL,
    "textualGenreId" TEXT NOT NULL,

    CONSTRAINT "TextualGenreOnArticles_pkey" PRIMARY KEY ("textualGenreId","articleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "textualgenres_name_key" ON "textualgenres"("name");

-- AddForeignKey
ALTER TABLE "TextualGenreOnArticles" ADD CONSTRAINT "TextualGenreOnArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextualGenreOnArticles" ADD CONSTRAINT "TextualGenreOnArticles_textualGenreId_fkey" FOREIGN KEY ("textualGenreId") REFERENCES "textualgenres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
