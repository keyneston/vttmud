-- CreateTable
CREATE TABLE "DowntimeEntry" (
    "id" SERIAL NOT NULL,
    "characterID" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "roll" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL,
    "dc" INTEGER NOT NULL,
    "assurance" BOOLEAN NOT NULL,

    CONSTRAINT "DowntimeEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CharacterLogEntry" ADD CONSTRAINT "CharacterLogEntry_characterID_fkey" FOREIGN KEY ("characterID") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DowntimeEntry" ADD CONSTRAINT "DowntimeEntry_characterID_fkey" FOREIGN KEY ("characterID") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
