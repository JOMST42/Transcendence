/*
  Warnings:

  - A unique constraint covering the columns `[twoFASecret]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "twoFAEnable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFASecret" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_twoFASecret_key" ON "users"("twoFASecret");
