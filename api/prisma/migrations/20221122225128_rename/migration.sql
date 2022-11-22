/*
  Warnings:

  - You are about to drop the column `protected` on the `chatrooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chatrooms" DROP COLUMN "protected",
ADD COLUMN     "isProtected" BOOLEAN NOT NULL DEFAULT false;
