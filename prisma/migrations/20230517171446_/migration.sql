/*
  Warnings:

  - You are about to drop the `MenuAlert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MenuAlert";

-- DropTable
DROP TABLE "SocialMedia";

-- CreateTable
CREATE TABLE "socialMedias" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "socialMedias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menuAlerts" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "menuAlertIsActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "menuAlerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "socialMedias_name_key" ON "socialMedias"("name");
