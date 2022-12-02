/*
  Warnings:

  - The `visibility` column on the `chatrooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `user_chatrooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `user_chatrooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `user_connections` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "chatrooms" ADD COLUMN     "isDM" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "visibility",
ADD COLUMN     "visibility" "ChatRoomVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "user_chatrooms" DROP COLUMN "status",
ADD COLUMN     "status" "UserChatStatus" NOT NULL DEFAULT 'NORMAL',
DROP COLUMN "role",
ADD COLUMN     "role" "ChatRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "user_connections" DROP COLUMN "type",
ADD COLUMN     "type" "SocketType" NOT NULL;
