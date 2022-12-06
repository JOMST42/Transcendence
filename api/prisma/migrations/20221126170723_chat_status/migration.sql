/*
  Warnings:

  - The `winner` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `visibility` column on the `chatrooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `user_chatrooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `user_connections` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserChatStatus" AS ENUM ('NORMAL', 'MUTED', 'BANNED');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "winner",
ADD COLUMN     "winner" "Winner" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "chatrooms" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "ChatRoomVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "user_chatrooms" ADD COLUMN     "status" "UserChatStatus" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "statusTimer" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "role",
ADD COLUMN     "role" "ChatRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "user_connections" DROP COLUMN "type",
ADD COLUMN     "type" "SocketType" NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'OFFLINE';
