-- AlterTable
ALTER TABLE "UpdatableAsset" ADD COLUMN "purchasePrice" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "UpdatableAsset" ADD COLUMN "depreciationRatePercent" INTEGER NOT NULL DEFAULT 20;
ALTER TABLE "UpdatableAsset" ADD COLUMN "usefulLifeYears" INTEGER NOT NULL DEFAULT 5;
