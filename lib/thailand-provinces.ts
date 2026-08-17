import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import type { LandAsset, LandStatus } from "@/lib/land-types";

export type ProvinceGeoProperties = {
  pro_code: string;
  pro_th: string;
  pro_en: string;
  reg_royin: string;
};

export type ProvinceFeatureCollection = FeatureCollection<
  Polygon | MultiPolygon,
  ProvinceGeoProperties
>;

/** Cream-to-orange choropleth scale */
export const HEATMAP_COLORS = {
  none: "#f9f5f2",
  low: "#ffe0cc",
  mid: "#ff9a54",
  high: "#ff6b1a",
  max: "#c44500",
} as const;

export function getProvinceHeatColor(value: number, max: number): string {
  if (value <= 0) return HEATMAP_COLORS.none;
  const ratio = value / max;
  if (ratio < 0.25) return HEATMAP_COLORS.low;
  if (ratio < 0.5) return "#ffb380";
  if (ratio < 0.75) return HEATMAP_COLORS.mid;
  if (ratio < 0.9) return HEATMAP_COLORS.high;
  return HEATMAP_COLORS.max;
}

export function findProvinceCode(
  geo: ProvinceFeatureCollection,
  latitude: number,
  longitude: number
): string | null {
  const pt = point([longitude, latitude]);

  for (const feature of geo.features) {
    if (booleanPointInPolygon(pt, feature as Feature<Polygon | MultiPolygon>)) {
      return feature.properties?.pro_code ?? null;
    }
  }

  return null;
}

export function aggregateProvinceValues(
  geo: ProvinceFeatureCollection,
  assets: LandAsset[]
): Record<string, number> {
  const values: Record<string, number> = {};

  for (const asset of assets) {
    const code = findProvinceCode(geo, asset.latitude, asset.longitude);
    if (!code) continue;
    values[code] = (values[code] ?? 0) + asset.purchasePrice;
  }

  return values;
}

export function filterAssetsByProvince(
  assets: LandAsset[],
  geo: ProvinceFeatureCollection,
  provinceCode: string
): LandAsset[] {
  return assets.filter(
    (asset) =>
      findProvinceCode(geo, asset.latitude, asset.longitude) === provinceCode
  );
}

export function getProvinceName(
  geo: ProvinceFeatureCollection,
  provinceCode: string,
  locale: "th" | "en"
): string {
  const feature = geo.features.find((f) => f.properties?.pro_code === provinceCode);
  if (!feature?.properties) return provinceCode;
  return locale === "th"
    ? feature.properties.pro_th
    : feature.properties.pro_en;
}

export type AssetTypeFilter = "all" | LandStatus;

export function filterAssetsByType(
  assets: LandAsset[],
  filter: AssetTypeFilter
): LandAsset[] {
  if (filter === "all") return assets;
  return assets.filter((a) => a.landStatus === filter);
}
