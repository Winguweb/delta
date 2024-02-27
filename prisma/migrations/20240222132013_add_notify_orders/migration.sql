-- CreateTable
CREATE TABLE "NotifyOrder" (
    "id" UUID NOT NULL,
    "telephone" VARCHAR(100) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotifyOrder_pkey" PRIMARY KEY ("id")
);
