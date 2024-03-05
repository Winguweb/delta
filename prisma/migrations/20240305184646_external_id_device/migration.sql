/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Sample" DROP CONSTRAINT "Sample_samplingPointId_fkey";

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "externalId" VARCHAR(100);

-- AlterTable
ALTER TABLE "Sample" ALTER COLUMN "samplingPointId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Device_externalId_key" ON "Device"("externalId");

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_samplingPointId_fkey" FOREIGN KEY ("samplingPointId") REFERENCES "SamplingPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
