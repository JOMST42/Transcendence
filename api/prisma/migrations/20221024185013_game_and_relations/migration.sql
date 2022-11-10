-- CreateEnum
CREATE TYPE "Winner" AS ENUM ('PLAYER1', 'PLAYER2', 'NONE');

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "player1Id" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "winner" "Winner" NOT NULL DEFAULT 'NONE',
    "scorePlayer1" INTEGER NOT NULL DEFAULT 0,
    "scorePlayer2" INTEGER NOT NULL DEFAULT 0,
    "ballBounce" INTEGER NOT NULL DEFAULT 0,
    "longestRally" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_player1Id_key" ON "Game"("player1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_player2Id_key" ON "Game"("player2Id");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
