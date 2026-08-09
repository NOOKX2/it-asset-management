export type AssetStatus = "active" | "needs_repair" | "storage" | "review";

export interface UpdatableAsset {
  id: string;
  userId?: string;
  type: string;
  assignedTo: string;
  location: string;
  status: AssetStatus;
  warrantyExpiry: string;
}

export const STATUS_LABELS: Record<AssetStatus, string> = {
  active: "Active",
  needs_repair: "Needs Repair",
  storage: "Storage",
  review: "Under Review",
};
