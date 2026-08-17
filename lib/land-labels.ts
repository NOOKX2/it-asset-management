import type { Messages } from "@/lib/i18n/types";
import type { ImprovementStatus, LandStatus } from "@/lib/land-types";

export function getLandStatusLabel(
  status: LandStatus,
  land: Messages["land"]
): string {
  const map: Record<LandStatus, string> = {
    for_rent: land.statusForRent,
    bank_mortgage: land.statusMortgage,
    in_use: land.statusInUse,
    vacant: land.statusVacant,
  };
  return map[status];
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

export function getImprovementLabel(
  status: ImprovementStatus,
  land: Messages["land"]
): string {
  const map: Record<ImprovementStatus, string> = {
    developed: land.improvementDeveloped,
    undeveloped: land.improvementUndeveloped,
    partial: land.improvementPartial,
  };
  return map[status];
}
