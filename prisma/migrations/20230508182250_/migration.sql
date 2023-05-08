/*
  Warnings:

  - You are about to drop the column `schoolLevel` on the `courses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `articles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolLevelId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "schoolLevel",
ADD COLUMN     "schoolLevelId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "SchoolLevel";

-- CreateTable
CREATE TABLE "SchoolLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SchoolLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolLevel_name_key" ON "SchoolLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "articles_url_key" ON "articles"("url");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_schoolLevelId_fkey" FOREIGN KEY ("schoolLevelId") REFERENCES "SchoolLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
