-- DropForeignKey
ALTER TABLE "ClassOnArticles" DROP CONSTRAINT "ClassOnArticles_classId_fkey";

-- AddForeignKey
ALTER TABLE "ClassOnArticles" ADD CONSTRAINT "ClassOnArticles_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
