/*
  Warnings:

  - You are about to drop the column `settingId` on the `MenuAlert` table. All the data in the column will be lost.
  - You are about to drop the column `settingId` on the `SocialMedia` table. All the data in the column will be lost.
  - You are about to drop the column `menuAlertId` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `menuAlertIsActive` on the `settings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SocialMedia" DROP CONSTRAINT "SocialMedia_settingId_fkey";

-- DropForeignKey
ALTER TABLE "settings" DROP CONSTRAINT "settings_menuAlertId_fkey";

-- AlterTable
ALTER TABLE "MenuAlert" DROP COLUMN "settingId",
ADD COLUMN     "menuAlertIsActive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SocialMedia" DROP COLUMN "settingId";

-- AlterTable
ALTER TABLE "settings" DROP COLUMN "menuAlertId",
DROP COLUMN "menuAlertIsActive";
