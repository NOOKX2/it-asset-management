import type { UpdatableAsset } from "@/lib/update-types";

export type DepreciationRow = {
  id: string;
  name: string;
  purchase: number;
  annual: number;
  accumulated: number;
  book: number;
  rate: string;
};

export function getAssetAgeYears(createdAt: string | undefined): number {
  if (!createdAt) return 0;
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return 0;
  return (Date.now() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

export function computeDepreciation(
  purchasePrice: number,
  depreciationRatePercent: number,
  usefulLifeYears: number,
  ageYears: number
) {
  const price = Number(purchasePrice);
  const ratePct = Number(depreciationRatePercent);
  const life = Number(usefulLifeYears);
  const age = Number(ageYears);

  const safePrice = Number.isFinite(price) ? price : 0;
  const safeRate = Number.isFinite(ratePct) && ratePct > 0 ? ratePct : 20;
  const safeLife = Number.isFinite(life) && life > 0 ? life : 5;
  const safeAge = Number.isFinite(age) && age > 0 ? age : 0;

  if (safePrice <= 0) {
    return { annual: 0, accumulated: 0, book: 0, rate: "N/A" };
  }

  const annual = Math.round(safePrice * (safeRate / 100));
  const yearsDepreciated = Math.min(safeAge, safeLife);
  const accumulated = Math.min(Math.round(annual * yearsDepreciated), safePrice);
  const book = safePrice - accumulated;

  return {
    annual,
    accumulated,
    book,
    rate: `${safeRate}%`,
  };
}

export function isItAsset(asset: UpdatableAsset): boolean {
  return asset.type.toLowerCase() !== "land";
}

export function toDepreciationRow(asset: UpdatableAsset): DepreciationRow {
  const ageYears = getAssetAgeYears(asset.createdAt);
  const { annual, accumulated, book, rate } = computeDepreciation(
    asset.purchasePrice,
    asset.depreciationRatePercent,
    asset.usefulLifeYears,
    ageYears
  );

  return {
    id: asset.id,
    name: asset.type,
    purchase: asset.purchasePrice,
    annual,
    accumulated,
    book,
    rate,
  };
}

export function computeDepreciationForecastPoints(
  bookValues: number[],
  annualDepreciation: number,
  years = 5
): number[] {
  const start = bookValues.reduce((sum, value) => sum + value, 0);
  if (start <= 0) return Array.from({ length: years + 1 }, () => 0);

  const points: number[] = [start];
  let book = start;

  for (let year = 1; year <= years; year += 1) {
    book = Math.max(0, book - annualDepreciation);
    points.push(book);
  }

  const peak = points[0] || 1;
  return points.map((value) => (value / peak) * 100);
}

export function computeHealthBreakdown(assets: UpdatableAsset[]) {
  const itAssets = assets.filter(isItAsset);
  const total = itAssets.length;

  if (total === 0) {
    return [
      { key: "optimal", pct: 0 },
      { key: "maintenance", pct: 0 },
      { key: "critical", pct: 0 },
    ];
  }

  let optimal = 0;
  let maintenance = 0;
  let critical = 0;

  for (const asset of itAssets) {
    if (asset.status === "active") optimal += 1;
    else if (asset.status === "needs_repair") critical += 1;
    else maintenance += 1;
  }

  const toPct = (count: number) => Math.round((count / total) * 100);

  return [
    { key: "optimal", pct: toPct(optimal) },
    { key: "maintenance", pct: toPct(maintenance) },
    { key: "critical", pct: toPct(critical) },
  ];
}
