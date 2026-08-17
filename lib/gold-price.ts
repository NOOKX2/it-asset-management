import type { LiquidityAsset } from "@/lib/liquidity-types";

export function isGoldSecurity(securityType: string) {
  const lower = securityType.toLowerCase();
  return lower.includes("gold") || lower.includes("ทอง");
}

const BAHT_WEIGHT = /(\d+(?:\.\d+)?)\s*(บาท|baht)/i;
const GRAM_WEIGHT = /(\d+(?:\.\d+)?)\s*(กรัม|grams?|g)\b/i;
const GOLD_BAHT_GRAMS = 15.244;

export function parseGoldWeightBaht(text: string): number | null {
  const baht = text.match(BAHT_WEIGHT);
  if (baht) {
    const value = Number(baht[1]);
    return Number.isFinite(value) && value > 0 ? value : null;
  }
  const grams = text.match(GRAM_WEIGHT);
  if (grams) {
    const value = Number(grams[1]) / GOLD_BAHT_GRAMS;
    return Number.isFinite(value) && value > 0 ? value : null;
  }
  return null;
}

function goldWeightKey(id: number) {
  return `gold-weight-baht:${id}`;
}

function readCachedWeight(id: number): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(goldWeightKey(id));
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function writeCachedWeight(id: number, weight: number) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(goldWeightKey(id), String(weight));
}

export function goldWeightBaht(asset: LiquidityAsset, buyPerBaht: number): number {
  const parsed =
    parseGoldWeightBaht(asset.remarks) ?? parseGoldWeightBaht(asset.format);
  if (parsed) return parsed;

  const cached = readCachedWeight(asset.id);
  if (cached) return cached;

  const inferred = buyPerBaht > 0 ? asset.currentPrice / buyPerBaht : 0;
  if (inferred > 0) writeCachedWeight(asset.id, inferred);
  return inferred;
}

export function applyGoldBuyPrice(
  assets: LiquidityAsset[],
  buyPerBaht: number | null | undefined
): LiquidityAsset[] {
  if (!buyPerBaht || buyPerBaht <= 0) return assets;

  return assets.map((asset) => {
    if (!isGoldSecurity(asset.securityType)) return asset;
    const weight = goldWeightBaht(asset, buyPerBaht);
    if (!weight) return asset;
    const currentPrice = Math.round(weight * buyPerBaht);
    return {
      ...asset,
      currentPrice,
      moneyMarketValue: currentPrice,
      assetsValue: currentPrice + asset.debtorsValue - asset.creditorsValue,
    };
  });
}
