-- CreateTable
CREATE TABLE "Report" (
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

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorsOnReports" (
    "reportId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "AuthorsOnReports_pkey" PRIMARY KEY ("reportId","authorId")
);

-- CreateTable
CREATE TABLE "ReportImages" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "ReportImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_publishedByUserId_fkey" FOREIGN KEY ("publishedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_editedByUserId_fkey" FOREIGN KEY ("editedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorsOnReports" ADD CONSTRAINT "AuthorsOnReports_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorsOnReports" ADD CONSTRAINT "AuthorsOnReports_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportImages" ADD CONSTRAINT "ReportImages_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
