/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SocialMedia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SocialMedia_name_key" ON "SocialMedia"("name");
