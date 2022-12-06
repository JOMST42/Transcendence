/*
  Warnings:

  - You are about to drop the column `isTwoFactorAuthenticated` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFAEnable` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isTwoFactorAuthenticated",
DROP COLUMN "twoFAEnable",
ADD COLUMN     "isTwoFactorAuthEnabled" BOOLEAN NOT NULL DEFAULT false;
