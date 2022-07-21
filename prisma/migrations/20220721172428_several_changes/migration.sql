/*
  Warnings:

  - The values [USERSREPOSITORY] on the enum `LogRepository` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `conteudoAnterior` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `conteudoNovo` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expires_date` on the `user_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `user_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `contentEdited` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editedByUserId` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresDate` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LogRepository_new" AS ENUM ('USER');
ALTER TABLE "logs" ALTER COLUMN "logRepository" TYPE "LogRepository_new" USING ("logRepository"::text::"LogRepository_new");
ALTER TYPE "LogRepository" RENAME TO "LogRepository_old";
ALTER TYPE "LogRepository_new" RENAME TO "LogRepository";
DROP TYPE "LogRepository_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_tokens" DROP CONSTRAINT "user_tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "logs" DROP COLUMN "conteudoAnterior",
DROP COLUMN "conteudoNovo",
DROP COLUMN "criadoEm",
DROP COLUMN "descricao",
DROP COLUMN "userId",
ADD COLUMN     "contentEdited" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "editedByUserId" TEXT NOT NULL,
ADD COLUMN     "previousContent" TEXT NOT NULL DEFAULT E'Sem conteúdo Anterior';

-- AlterTable
ALTER TABLE "user_tokens" DROP COLUMN "created_at",
DROP COLUMN "expires_date",
DROP COLUMN "refresh_token",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar_url",
DROP COLUMN "created_at",
DROP COLUMN "last_name",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_editedByUserId_fkey" FOREIGN KEY ("editedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
