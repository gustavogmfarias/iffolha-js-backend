/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `newsletters` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "newsletters_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_email_key" ON "newsletters"("email");
