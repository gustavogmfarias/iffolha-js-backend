/*
  Warnings:

  - Added the required column `modelEditedId` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "modelEditedId" TEXT NOT NULL;
