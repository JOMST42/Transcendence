-- CreateTable
CREATE TABLE "friendships" (
    "requesterId" INTEGER NOT NULL,
    "adresseeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("requesterId","adresseeId")
);

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_adresseeId_fkey" FOREIGN KEY ("adresseeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
