-- CreateTable
CREATE TABLE "weather" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weather_pkey" PRIMARY KEY ("id")
);
