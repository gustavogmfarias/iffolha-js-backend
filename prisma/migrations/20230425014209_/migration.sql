-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "logo" TEXT,
    "favicon" TEXT,
    "mainBarColor" TEXT,
    "menuAlertIsActive" BOOLEAN NOT NULL DEFAULT false,
    "menuAlertId" TEXT,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "settingId" TEXT,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuAlert" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "settingId" TEXT,

    CONSTRAINT "MenuAlert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_menuAlertId_fkey" FOREIGN KEY ("menuAlertId") REFERENCES "MenuAlert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
