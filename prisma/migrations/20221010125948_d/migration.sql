/*
  Warnings:

  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthorsOnReports" DROP CONSTRAINT "AuthorsOnReports_reportId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_editedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_publishedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "ReportImages" DROP CONSTRAINT "ReportImages_reportId_fkey";

-- AlterTable
ALTER TABLE "ReportImages" ALTER COLUMN "isMain" SET DEFAULT false;

-- DropTable
DROP TABLE "Report";

-- CreateTable
CREATE TABLE "reports" (
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

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_publishedByUserId_fkey" FOREIGN KEY ("publishedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_editedByUserId_fkey" FOREIGN KEY ("editedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorsOnReports" ADD CONSTRAINT "AuthorsOnReports_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportImages" ADD CONSTRAINT "ReportImages_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
