-- Add userId columns (nullable for backfill)
ALTER TABLE "LandAsset" ADD COLUMN "userId" TEXT;
ALTER TABLE "LiquidityAsset" ADD COLUMN "userId" TEXT;
ALTER TABLE "Vendor" ADD COLUMN "userId" TEXT;
ALTER TABLE "UpdatableAsset" ADD COLUMN "userId" TEXT;

-- Backfill existing rows to the first user when present
UPDATE "LandAsset"
SET "userId" = (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "userId" IS NULL;

UPDATE "LiquidityAsset"
SET "userId" = (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "userId" IS NULL;

UPDATE "Vendor"
SET "userId" = (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "userId" IS NULL;

UPDATE "UpdatableAsset"
SET "userId" = (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "userId" IS NULL;

-- Remove rows that cannot be assigned to a user
DELETE FROM "LandAsset" WHERE "userId" IS NULL;
DELETE FROM "LiquidityAsset" WHERE "userId" IS NULL;
DELETE FROM "Vendor" WHERE "userId" IS NULL;
DELETE FROM "UpdatableAsset" WHERE "userId" IS NULL;

-- Enforce NOT NULL
ALTER TABLE "LandAsset" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "LiquidityAsset" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Vendor" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "UpdatableAsset" ALTER COLUMN "userId" SET NOT NULL;

-- Foreign keys
ALTER TABLE "LandAsset"
ADD CONSTRAINT "LandAsset_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LiquidityAsset"
ADD CONSTRAINT "LiquidityAsset_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Vendor"
ADD CONSTRAINT "Vendor_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UpdatableAsset"
ADD CONSTRAINT "UpdatableAsset_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "LandAsset_userId_idx" ON "LandAsset"("userId");
CREATE INDEX "LiquidityAsset_userId_idx" ON "LiquidityAsset"("userId");
CREATE INDEX "Vendor_userId_idx" ON "Vendor"("userId");
CREATE INDEX "UpdatableAsset_userId_idx" ON "UpdatableAsset"("userId");
