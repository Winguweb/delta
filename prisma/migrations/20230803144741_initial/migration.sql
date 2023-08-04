-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COLLABORATOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "WaterBodyType" AS ENUM ('RIO', 'LAGO', 'LAGUNA');

-- CreateEnum
CREATE TYPE "AreaType" AS ENUM ('URBANO', 'RURAL');

-- CreateEnum
CREATE TYPE "SampleParameterType" AS ENUM ('FISICA', 'QUIMICA', 'BIOLOGICA', 'HABITAT');

-- CreateEnum
CREATE TYPE "NewsPostStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(100) NOT NULL,
    "resetPasswordToken" VARCHAR(200),
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL,
    "organizationName" VARCHAR(100) NOT NULL,
    "organizationRole" VARCHAR(100) NOT NULL,
    "organizationCountryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SamplingPoint" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "description" VARCHAR(280),
    "waterBodyName" VARCHAR(100),
    "waterBodyType" "WaterBodyType" NOT NULL,
    "areaType" "AreaType" NOT NULL,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "SamplingPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(280),
    "components" VARCHAR(280),
    "samplingPointId" UUID,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleMeasurementValue" (
    "id" UUID NOT NULL,
    "parameterId" UUID NOT NULL,
    "sampleId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SampleMeasurementValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmationTokenAWS" (
    "id" UUID NOT NULL,
    "arn" VARCHAR(2048) NOT NULL,
    "confirmationToken" VARCHAR(2048) NOT NULL,

    CONSTRAINT "ConfirmationTokenAWS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleParameter" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "SampleParameterType" NOT NULL,
    "unit" VARCHAR(100) NOT NULL,

    CONSTRAINT "SampleParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" SERIAL NOT NULL,
    "samplingPointId" UUID NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "takenById" UUID NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(280) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "status" "NewsPostStatus" NOT NULL,

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" UUID NOT NULL,
    "question" VARCHAR(512) NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "About" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Change" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(280),
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Change_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SampleMeasurementValue_parameterId_sampleId_key" ON "SampleMeasurementValue"("parameterId", "sampleId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationTokenAWS_arn_key" ON "ConfirmationTokenAWS"("arn");

-- CreateIndex
CREATE UNIQUE INDEX "SampleParameter_name_key" ON "SampleParameter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "About_id_key" ON "About"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationCountryId_fkey" FOREIGN KEY ("organizationCountryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SamplingPoint" ADD CONSTRAINT "SamplingPoint_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_samplingPointId_fkey" FOREIGN KEY ("samplingPointId") REFERENCES "SamplingPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleMeasurementValue" ADD CONSTRAINT "SampleMeasurementValue_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "SampleParameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleMeasurementValue" ADD CONSTRAINT "SampleMeasurementValue_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_samplingPointId_fkey" FOREIGN KEY ("samplingPointId") REFERENCES "SamplingPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_takenById_fkey" FOREIGN KEY ("takenById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
