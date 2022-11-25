-- AlterTable
ALTER TABLE "Articles" ALTER COLUMN "mainImage" DROP NOT NULL,
ALTER COLUMN "editedByUserId" DROP NOT NULL,
ALTER COLUMN "updatedDate" DROP NOT NULL;
