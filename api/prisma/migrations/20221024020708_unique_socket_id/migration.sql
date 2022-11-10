/*
  Warnings:

  - A unique constraint covering the columns `[socketId]` on the table `UserConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserConnection_socketId_key" ON "UserConnection"("socketId");
