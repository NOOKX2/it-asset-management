import type { Messages } from "@/lib/i18n/types";
import type { LandAsset } from "@/lib/land-types";

export function getLandCategoryLabel(
  asset: LandAsset,
  land: Messages["land"]
): string {
  if (asset.improvementStatus === "undeveloped") {
    return land.categoryAgricultural;
  }
  if (asset.landStatus === "for_rent" || asset.hasStructures) {
    return land.categoryCommercial;
  }
  if (asset.improvementStatus === "partial") {
    return land.categoryIndustrial;
  }
  return land.categoryResidential;
}

export function formatShowingRange(
  template: string,
  start: number,
  end: number,
  total: number
): string {
  return template
    .replace("{start}", String(start))
    .replace("{end}", String(end))
    .replace("{total}", String(total));
}
