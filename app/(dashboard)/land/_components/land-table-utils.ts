import type { LandStatus } from "@/lib/land-types";

export const LAND_TABLE_PAGE_SIZE = 5;

export function formatCompactBaht(amount: number) {
  if (amount >= 1_000_000_000) {
    return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `฿${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `฿${(amount / 1_000).toFixed(0)}K`;
}

export function getStatusBadgeClass(status: LandStatus): string {
  switch (status) {
    case "in_use":
      return "bg-green-100 text-green-700";
    case "for_rent":
      return "bg-[var(--light-green-bg)] text-[var(--primary-green-dark)]";
    case "vacant":
      return "bg-gray-100 text-gray-600";
    case "bank_mortgage":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
