import type { AssetStatus } from "@/lib/update-types";

export const STATUS_STYLES: Record<AssetStatus, string> = {
  active: "bg-green-100 text-green-700",
  needs_repair: "bg-red-100 text-red-700",
  storage: "bg-gray-100 text-gray-600",
  review: "bg-yellow-100 text-yellow-700",
};

export const STATUS_KEYS: AssetStatus[] = [
  "active",
  "needs_repair",
  "storage",
  "review",
];

export const RECENT_UPDATE_MS = 24 * 60 * 60 * 1000;

export function isRecentUpdate(updatedAt: string | undefined): boolean {
  if (!updatedAt) return false;
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(updated)) return false;
  return Date.now() - updated <= RECENT_UPDATE_MS;
}
