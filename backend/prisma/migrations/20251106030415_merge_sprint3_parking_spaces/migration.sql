-- CreateEnum
CREATE TYPE "ParkingSpaceType" AS ENUM ('COMPACT', 'LARGE', 'HANDICAPPED', 'MOTORCYCLE');

-- CreateEnum
CREATE TYPE "ParkingSpaceState" AS ENUM ('DISPONIBLE', 'OCUPADO', 'RESERVADO', 'MANTENIMIENTO');

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "parkingSpaceId" INTEGER;

-- CreateTable
CREATE TABLE "parking_spaces" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "type" "ParkingSpaceType" NOT NULL,
    "state" "ParkingSpaceState" NOT NULL DEFAULT 'DISPONIBLE',
    "row" INTEGER,
    "col" INTEGER,
    "vehicleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_spaces_number_key" ON "parking_spaces"("number");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_parkingSpaceId_fkey" FOREIGN KEY ("parkingSpaceId") REFERENCES "parking_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
