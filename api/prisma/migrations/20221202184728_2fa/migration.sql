-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isTwoFactorAuthenticated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFAEnable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFASecret" TEXT;
