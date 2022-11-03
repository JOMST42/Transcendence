/*
  Warnings:

  - You are about to drop the column `pending` on the `friendships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friendships" DROP COLUMN "pending",
ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false;
