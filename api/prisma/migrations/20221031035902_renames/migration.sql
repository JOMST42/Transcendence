/*
  Warnings:

  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_rooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_roomId_fkey";

-- DropForeignKey
ALTER TABLE "user_rooms" DROP CONSTRAINT "user_rooms_roomId_fkey";

-- DropForeignKey
ALTER TABLE "user_rooms" DROP CONSTRAINT "user_rooms_userId_fkey";

-- DropTable
DROP TABLE "rooms";

-- DropTable
DROP TABLE "user_rooms";

-- CreateTable
CREATE TABLE "chatrooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chatrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_chatrooms" (
    "userId" INTEGER NOT NULL,
    "roomId" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_chatrooms_pkey" PRIMARY KEY ("userId","roomId")
);

-- AddForeignKey
ALTER TABLE "user_chatrooms" ADD CONSTRAINT "user_chatrooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chatrooms" ADD CONSTRAINT "user_chatrooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
