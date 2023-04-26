/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Server` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordID]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Server_slug_key" ON "Server"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Server_discordID_key" ON "Server"("discordID");
