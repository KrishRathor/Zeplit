/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `UserGoogleToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshToken` to the `UserGoogleToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGoogleToken" ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserGoogleToken_refreshToken_key" ON "UserGoogleToken"("refreshToken");
