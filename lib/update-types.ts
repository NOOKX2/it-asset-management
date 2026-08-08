export type AssetStatus = "active" | "needs_repair" | "storage" | "review";

export interface UpdatableAsset {
  id: string;
  type: string;
  assignedTo: string;
  location: string;
  status: AssetStatus;
  warrantyExpiry: string;
}

export const MOCK_UPDATABLE_ASSETS: UpdatableAsset[] = [
  {
    id: "LT-2023-041",
    type: "Laptop",
    assignedTo: "Michael T.",
    location: "Bangkok HQ",
    status: "active",
    warrantyExpiry: "2026-12-31",
  },
  {
    id: "SRV-NY-012",
    type: "Server",
    assignedTo: "IT Operations",
    location: "Data Center A",
    status: "needs_repair",
    warrantyExpiry: "2025-06-15",
  },
  {
    id: "PL-882",
    type: "Land",
    assignedTo: "Property Dept.",
    location: "Sukhumvit, Bangkok",
    status: "active",
    warrantyExpiry: "",
  },
  {
    id: "MON-045",
    type: "Monitor",
    assignedTo: "Sarah K.",
    location: "Chiang Mai Branch",
    status: "storage",
    warrantyExpiry: "2024-03-20",
  },
  {
    id: "NET-SW-008",
    type: "Network Switch",
    assignedTo: "IT Operations",
    location: "Bangkok HQ",
    status: "review",
    warrantyExpiry: "2027-01-10",
  },
];

export const STATUS_LABELS: Record<AssetStatus, string> = {
  active: "Active",
  needs_repair: "Needs Repair",
  storage: "Storage",
  review: "Under Review",
};
