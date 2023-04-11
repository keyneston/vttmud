-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterLogEntry" (
    "id" SERIAL NOT NULL,
    "characterID" INTEGER NOT NULL,
    "experience" INTEGER,
    "spend" BOOLEAN DEFAULT false,
    "platinum" INTEGER,
    "gold" INTEGER,
    "silver" INTEGER,
    "copper" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterLogEntry_pkey" PRIMARY KEY ("id")
);
