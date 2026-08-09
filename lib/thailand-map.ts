import type { LandAsset } from "@/lib/land-types";

/** Thailand geographic bounds for map viewport */
export const THAILAND_CENTER: [number, number] = [13.2, 101.0];
export const THAILAND_DEFAULT_ZOOM = 6;

export const THAILAND_BOUNDS: [[number, number], [number, number]] = [
  [5.5, 97.0],
  [20.5, 106.0],
];

export type LandAssetLegacy = LandAsset & {
  mapX?: number;
  mapY?: number;
};

/** Convert legacy percentage positions to lat/lng within Thailand */
export function mapPercentToLatLng(mapX: number, mapY: number): [number, number] {
  const lat = 5.6 + (mapY / 100) * (20.5 - 5.6);
  const lng = 97.3 + (mapX / 100) * (105.6 - 97.3);
  return [lat, lng];
}

export function normalizeLandAssetCoords(asset: LandAssetLegacy) {
  if (
    typeof asset.latitude === "number" &&
    typeof asset.longitude === "number"
  ) {
    return { latitude: asset.latitude, longitude: asset.longitude };
  }
  const [lat, lng] = mapPercentToLatLng(asset.mapX ?? 50, asset.mapY ?? 50);
  return { latitude: lat, longitude: lng };
}
