/*
  Warnings:

  - Added the required column `date` to the `DowntimeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `DowntimeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DowntimeEntry" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "details" TEXT NOT NULL;
