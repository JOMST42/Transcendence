/*
  Warnings:

  - You are about to drop the column `blocked` on the `friendships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friendships" DROP COLUMN "blocked",
ADD COLUMN     "adresseeBlocker" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requesterBlocker" BOOLEAN NOT NULL DEFAULT false;
