-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "detectedVehicleType" TEXT,
ADD COLUMN     "entryPhoto" TEXT,
ADD COLUMN     "exitPhoto" TEXT,
ADD COLUMN     "plateConfidence" DOUBLE PRECISION,
ADD COLUMN     "recognizedBy" TEXT;
