import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../lib/prisma";

const sampleDir = join(dirname(fileURLToPath(import.meta.url)), "sample-data");

function loadJson<T>(filename: string): T {
  const path = join(sampleDir, filename);
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

async function main() {
  const seedUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!seedUser) {
    console.log(
      "Seed skipped: no users in database. Register a user first, then run seed again."
    );
    return;
  }

  const userId = seedUser.id;

  const landAssets = loadJson<
    Array<{
      id: string;
      purchasePrice: number;
      sizeRai: number;
      sizeNgan: number;
      location: string;
      googleMapsUrl: string;
      landStatus: string;
      improvementStatus: string;
      hasStructures: boolean;
      titleDeedNumber: string;
      titleDeedBook: string;
      titleDeedPage: string;
      owner: string;
      description: string;
      imageUrl: string;
      latitude: number;
      longitude: number;
    }>
  >("land-assets.json");

  const liquidityAssets = loadJson<
    Array<{
      id: number;
      holder: string;
      securityType: string;
      format: string;
      issuingInstitution: string;
      costPrice: number;
      currentPrice: number;
      moneyMarketValue: number;
      debtorsValue: number;
      creditorsValue: number;
      assetsValue: number;
      remarks: string;
      symbol?: string;
      quantity?: number;
      goldWeightBaht?: number;
      yieldPercent?: number;
      couponFrequency?: string;
      navPerUnit?: number;
      borrowerName?: string;
      borrowedOn?: string;
    }>
  >("liquidity-assets.json");

  const vendors = loadJson<
    Array<{
      id: string;
      name: string;
      category: string;
      taxId: string;
      contactPerson: string;
      email: string;
      phone: string;
      website: string;
      address: string;
      province: string;
      district: string;
      assets: number;
      status: string;
    }>
  >("vendors.json");

  const updatableAssets = loadJson<
    Array<{
      id: string;
      type: string;
      assignedTo: string;
      location: string;
      status: string;
      warrantyExpiry: string;
      purchasePrice: number;
      depreciationRatePercent: number;
      usefulLifeYears: number;
      yearsOwned?: number;
    }>
  >("updatable-assets.json");

  for (const asset of landAssets) {
    await prisma.landAsset.upsert({
      where: { id: asset.id },
      create: { ...asset, userId },
      update: { ...asset, userId },
    });
  }

  for (const asset of liquidityAssets) {
    await prisma.liquidityAsset.upsert({
      where: { id: asset.id },
      create: { ...asset, userId },
      update: { ...asset, userId },
    });
  }

  if (liquidityAssets.length > 0) {
    const maxId = Math.max(...liquidityAssets.map((a) => a.id));
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"LiquidityAsset"', 'id'), $1, true)`,
      maxId
    );
  }

  for (const vendor of vendors) {
    await prisma.vendor.upsert({
      where: { id: vendor.id },
      create: { ...vendor, userId },
      update: { ...vendor, userId },
    });
  }

  for (const asset of updatableAssets) {
    const yearsOwned = asset.yearsOwned ?? 0;
    const createdAt =
      yearsOwned > 0
        ? new Date(Date.now() - yearsOwned * 365.25 * 24 * 60 * 60 * 1000)
        : undefined;

    await prisma.updatableAsset.upsert({
      where: { id: asset.id },
      create: {
        id: asset.id,
        userId,
        type: asset.type,
        assignedTo: asset.assignedTo,
        location: asset.location,
        status: asset.status,
        warrantyExpiry: asset.warrantyExpiry,
        purchasePrice: asset.purchasePrice,
        depreciationRatePercent: asset.depreciationRatePercent,
        usefulLifeYears: asset.usefulLifeYears,
        ...(createdAt ? { createdAt } : {}),
      },
      update: {
        userId,
        type: asset.type,
        assignedTo: asset.assignedTo,
        location: asset.location,
        status: asset.status,
        warrantyExpiry: asset.warrantyExpiry,
        purchasePrice: asset.purchasePrice,
        depreciationRatePercent: asset.depreciationRatePercent,
        usefulLifeYears: asset.usefulLifeYears,
        ...(createdAt ? { createdAt } : {}),
      },
    });
  }

  console.log(
    `Seed completed for user ${seedUser.email}: ${landAssets.length} land, ${liquidityAssets.length} liquidity, ${vendors.length} vendors, ${updatableAssets.length} updatable assets.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
