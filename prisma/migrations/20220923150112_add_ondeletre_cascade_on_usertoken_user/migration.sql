-- DropForeignKey
ALTER TABLE "userTokens" DROP CONSTRAINT "userTokens_userId_fkey";

-- AddForeignKey
ALTER TABLE "userTokens" ADD CONSTRAINT "userTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
