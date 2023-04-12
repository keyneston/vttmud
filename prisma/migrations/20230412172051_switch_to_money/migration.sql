/*
  Warnings:

  - You are about to drop the column `copper` on the `CharacterLogEntry` table. All the data in the column will be lost.
  - You are about to drop the column `platinum` on the `CharacterLogEntry` table. All the data in the column will be lost.
  - You are about to drop the column `silver` on the `CharacterLogEntry` table. All the data in the column will be lost.
  - You are about to drop the column `spend` on the `CharacterLogEntry` table. All the data in the column will be lost.
  - The `gold` column on the `CharacterLogEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CharacterLogEntry" DROP COLUMN "copper",
DROP COLUMN "platinum",
DROP COLUMN "silver",
DROP COLUMN "spend",
DROP COLUMN "gold",
ADD COLUMN     "gold" MONEY;
