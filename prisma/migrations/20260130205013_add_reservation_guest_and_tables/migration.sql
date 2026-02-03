/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserRoleType" AS ENUM ('ADMIN', 'OWNER', 'CLIENT');

-- CreateEnum
CREATE TYPE "public"."Sport" AS ENUM ('FOOTBALL', 'TENNIS', 'BASKETBALL', 'VOLLEYBALL', 'FUTSAL');

-- CreateEnum
CREATE TYPE "public"."WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."SportCenterStatus" AS ENUM ('ACTIVE', 'PENDING', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('NEW_RESERVATION', 'PAYMENT_TO_VERIFY', 'RESERVATION_CONFIRMED', 'SYSTEM_ALERT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PermissionResource" ADD VALUE 'SPORT_CENTER';
ALTER TYPE "public"."PermissionResource" ADD VALUE 'FIELD';
ALTER TYPE "public"."PermissionResource" ADD VALUE 'RESERVATION';
ALTER TYPE "public"."PermissionResource" ADD VALUE 'REVIEW';

-- DropIndex
DROP INDEX "public"."user_roles_expiresAt_idx";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."sport_centers" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT DEFAULT 'Lima',
    "district" TEXT,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "googleMapsUrl" TEXT,
    "status" "public"."SportCenterStatus" NOT NULL DEFAULT 'PENDING',
    "rating" DECIMAL(3,2),
    "images" TEXT[],
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sport_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fields" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sport" "public"."Sport" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT[],
    "address" TEXT NOT NULL,
    "city" TEXT DEFAULT 'Lima',
    "district" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "googleMapsUrl" TEXT,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "ownerId" TEXT NOT NULL,
    "sportCenterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schedules" (
    "id" TEXT NOT NULL,
    "day" "public"."WeekDay" NOT NULL,
    "startHour" TEXT NOT NULL,
    "endHour" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reservations" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "createdByChatbot" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "fieldId" TEXT NOT NULL,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "guestPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."field_features" (
    "id" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fieldId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "field_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."operating_schedules" (
    "id" TEXT NOT NULL,
    "day" "public"."WeekDay" NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "sportCenterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."features" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "requiresProof" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "proofImages" TEXT[],
    "reservationId" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sport_centers_slug_key" ON "public"."sport_centers"("slug");

-- CreateIndex
CREATE INDEX "sport_centers_ownerId_idx" ON "public"."sport_centers"("ownerId");

-- CreateIndex
CREATE INDEX "sport_centers_tenantId_idx" ON "public"."sport_centers"("tenantId");

-- CreateIndex
CREATE INDEX "sport_centers_status_idx" ON "public"."sport_centers"("status");

-- CreateIndex
CREATE INDEX "sport_centers_slug_idx" ON "public"."sport_centers"("slug");

-- CreateIndex
CREATE INDEX "sport_centers_latitude_longitude_idx" ON "public"."sport_centers"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "sport_centers_district_idx" ON "public"."sport_centers"("district");

-- CreateIndex
CREATE INDEX "fields_ownerId_idx" ON "public"."fields"("ownerId");

-- CreateIndex
CREATE INDEX "fields_sportCenterId_idx" ON "public"."fields"("sportCenterId");

-- CreateIndex
CREATE INDEX "fields_sport_idx" ON "public"."fields"("sport");

-- CreateIndex
CREATE INDEX "fields_available_idx" ON "public"."fields"("available");

-- CreateIndex
CREATE INDEX "fields_latitude_longitude_idx" ON "public"."fields"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "fields_district_idx" ON "public"."fields"("district");

-- CreateIndex
CREATE INDEX "schedules_fieldId_idx" ON "public"."schedules"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_fieldId_day_key" ON "public"."schedules"("fieldId", "day");

-- CreateIndex
CREATE INDEX "reservations_fieldId_idx" ON "public"."reservations"("fieldId");

-- CreateIndex
CREATE INDEX "reservations_userId_idx" ON "public"."reservations"("userId");

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "public"."reservations"("status");

-- CreateIndex
CREATE INDEX "reservations_createdByChatbot_idx" ON "public"."reservations"("createdByChatbot");

-- CreateIndex
CREATE INDEX "reservations_startDate_endDate_idx" ON "public"."reservations"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "field_features_fieldId_idx" ON "public"."field_features"("fieldId");

-- CreateIndex
CREATE INDEX "field_features_featureId_idx" ON "public"."field_features"("featureId");

-- CreateIndex
CREATE UNIQUE INDEX "field_features_fieldId_featureId_key" ON "public"."field_features"("fieldId", "featureId");

-- CreateIndex
CREATE INDEX "operating_schedules_sportCenterId_idx" ON "public"."operating_schedules"("sportCenterId");

-- CreateIndex
CREATE UNIQUE INDEX "operating_schedules_sportCenterId_day_key" ON "public"."operating_schedules"("sportCenterId", "day");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "public"."notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "public"."notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "public"."notifications"("type");

-- CreateIndex
CREATE UNIQUE INDEX "features_name_key" ON "public"."features"("name");

-- CreateIndex
CREATE INDEX "features_isActive_idx" ON "public"."features"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_name_key" ON "public"."payment_methods"("name");

-- CreateIndex
CREATE INDEX "payment_methods_isActive_idx" ON "public"."payment_methods"("isActive");

-- CreateIndex
CREATE INDEX "payment_methods_provider_idx" ON "public"."payment_methods"("provider");

-- CreateIndex
CREATE INDEX "payments_reservationId_idx" ON "public"."payments"("reservationId");

-- CreateIndex
CREATE INDEX "payments_paymentMethodId_idx" ON "public"."payments"("paymentMethodId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "public"."payments"("status");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "public"."payments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "public"."User"("isActive");

-- AddForeignKey
ALTER TABLE "public"."sport_centers" ADD CONSTRAINT "sport_centers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sport_centers" ADD CONSTRAINT "sport_centers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fields" ADD CONSTRAINT "fields_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fields" ADD CONSTRAINT "fields_sportCenterId_fkey" FOREIGN KEY ("sportCenterId") REFERENCES "public"."sport_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."field_features" ADD CONSTRAINT "field_features_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."field_features" ADD CONSTRAINT "field_features_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "public"."features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operating_schedules" ADD CONSTRAINT "operating_schedules_sportCenterId_fkey" FOREIGN KEY ("sportCenterId") REFERENCES "public"."sport_centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "public"."reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
