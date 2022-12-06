/*
  Warnings:

  - The `winner` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `user_connections` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "winner",
ADD COLUMN     "winner" "Winner" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "user_chatrooms" ADD COLUMN     "role" "ChatRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "user_connections" DROP COLUMN "type",
ADD COLUMN     "type" "SocketType" NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'OFFLINE';
