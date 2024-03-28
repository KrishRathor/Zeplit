-- CreateTable
CREATE TABLE "UserGoogleToken" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,

    CONSTRAINT "UserGoogleToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGoogleToken_username_key" ON "UserGoogleToken"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserGoogleToken_accessToken_key" ON "UserGoogleToken"("accessToken");
