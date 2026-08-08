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
