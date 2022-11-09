-- CreateEnum
CREATE TYPE "ChatRoomVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "chatrooms" ADD COLUMN     "visibility" "ChatRoomVisibility" NOT NULL DEFAULT 'PUBLIC';
