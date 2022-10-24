-- CreateEnum
CREATE TYPE "SocketType" AS ENUM ('GAME', 'CHAT');

-- CreateTable
CREATE TABLE "UserConnection" (
    "id" SERIAL NOT NULL,
    "socketId" TEXT NOT NULL,
    "type" "SocketType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserConnection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserConnection" ADD CONSTRAINT "UserConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
