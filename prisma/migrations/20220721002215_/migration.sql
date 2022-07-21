/*
  Warnings:

  - You are about to drop the column `createdAt` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `repository` on the `logs` table. All the data in the column will be lost.
  - Added the required column `conteudoNovo` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logRepository` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "logs" DROP COLUMN "createdAt",
DROP COLUMN "repository",
ADD COLUMN     "conteudoAnterior" TEXT NOT NULL DEFAULT E'Sem conteúdo Anterior',
ADD COLUMN     "conteudoNovo" TEXT NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "logRepository" "LogRepository" NOT NULL;
