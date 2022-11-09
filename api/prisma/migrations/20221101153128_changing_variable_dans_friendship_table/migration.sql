/*
  Warnings:

  - You are about to drop the column `Pending` on the `friendships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friendships" DROP COLUMN "Pending",
ADD COLUMN     "pending" BOOLEAN NOT NULL DEFAULT false;
