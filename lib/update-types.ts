export type AssetStatus = "active" | "needs_repair" | "storage" | "review";

export interface UpdatableAsset {
  id: string;
  userId?: string;
  type: string;
  assignedTo: string;
  location: string;
  status: AssetStatus;
  warrantyExpiry: string;
  purchasePrice: number;
  depreciationRatePercent: number;
  usefulLifeYears: number;
  createdAt?: string;
  updatedAt?: string;
}

export const STATUS_LABELS: Record<AssetStatus, string> = {
  active: "Active",
  needs_repair: "Needs Repair",
  storage: "Storage",
  review: "Under Review",
};

type UpdatableAssetRow = {
  id: string;
  userId: string;
  type: string;
  assignedTo: string;
  location: string;
  status: string;
  warrantyExpiry: string;
  purchasePrice: number;
  depreciationRatePercent: number;
  usefulLifeYears: number;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeUpdatableAsset(row: UpdatableAssetRow): UpdatableAsset {
  return normalizeUpdatableAsset({
    id: row.id,
    userId: row.userId,
    type: row.type,
    assignedTo: row.assignedTo,
    location: row.location,
    status: row.status as AssetStatus,
    warrantyExpiry: row.warrantyExpiry,
    purchasePrice: row.purchasePrice,
    depreciationRatePercent: row.depreciationRatePercent,
    usefulLifeYears: row.usefulLifeYears,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeUpdatableAsset(
  asset: Partial<UpdatableAsset> &
    Pick<
      UpdatableAsset,
      "id" | "type" | "assignedTo" | "location" | "status" | "warrantyExpiry"
    >
): UpdatableAsset {
  return {
    id: asset.id,
    userId: asset.userId,
    type: asset.type,
    assignedTo: asset.assignedTo,
    location: asset.location,
    status: asset.status,
    warrantyExpiry: asset.warrantyExpiry,
    purchasePrice: toNumber(asset.purchasePrice),
    depreciationRatePercent: toNumber(asset.depreciationRatePercent, 20),
    usefulLifeYears: toNumber(asset.usefulLifeYears, 5),
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  };
}
