-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_schoolLevelId_fkey";

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_schoolLevelId_fkey" FOREIGN KEY ("schoolLevelId") REFERENCES "SchoolLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
