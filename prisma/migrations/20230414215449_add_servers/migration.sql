-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "serverID" INTEGER;

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "discordID" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server"("id") ON DELETE SET NULL ON UPDATE CASCADE;
