/*
  Warnings:

  - You are about to drop the column `banned` on the `friendships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friendships" DROP COLUMN "banned",
ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;
