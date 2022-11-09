/*
  Warnings:

  - Made the column `startTime` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "startTime" SET NOT NULL,
ALTER COLUMN "startTime" SET DEFAULT CURRENT_TIMESTAMP;
