-- CreateTable
CREATE TABLE "LandAsset" (
    "id" TEXT NOT NULL,
    "purchasePrice" INTEGER NOT NULL,
    "sizeRai" INTEGER NOT NULL DEFAULT 0,
    "sizeNgan" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT NOT NULL,
    "googleMapsUrl" TEXT NOT NULL,
    "landStatus" TEXT NOT NULL,
    "improvementStatus" TEXT NOT NULL,
    "hasStructures" BOOLEAN NOT NULL DEFAULT false,
    "titleDeedNumber" TEXT NOT NULL DEFAULT '',
    "titleDeedBook" TEXT NOT NULL DEFAULT '',
    "titleDeedPage" TEXT NOT NULL DEFAULT '',
    "owner" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidityAsset" (
    "id" SERIAL NOT NULL,
    "holder" TEXT NOT NULL,
    "securityType" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "issuingInstitution" TEXT NOT NULL,
    "costPrice" INTEGER NOT NULL,
    "currentPrice" INTEGER NOT NULL,
    "moneyMarketValue" INTEGER NOT NULL,
    "debtorsValue" INTEGER NOT NULL DEFAULT 0,
    "creditorsValue" INTEGER NOT NULL DEFAULT 0,
    "assetsValue" INTEGER NOT NULL,
    "remarks" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiquidityAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "taxId" TEXT NOT NULL DEFAULT '',
    "contactPerson" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "province" TEXT NOT NULL DEFAULT '',
    "district" TEXT NOT NULL DEFAULT '',
    "assets" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpdatableAsset" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "warrantyExpiry" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpdatableAsset_pkey" PRIMARY KEY ("id")
);
