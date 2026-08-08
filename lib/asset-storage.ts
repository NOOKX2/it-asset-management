import type { LandAsset } from "@/lib/land-types";
import type { LiquidityAsset } from "@/lib/liquidity-types";
import type { Vendor } from "@/lib/vendor-types";

const LAND_KEY = "itam-added-land";
const LIQUIDITY_KEY = "itam-added-liquidity";

function readJson<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, items: T[]) {
  sessionStorage.setItem(key, JSON.stringify(items));
}

export function getAddedLandAssets(): LandAsset[] {
  return readJson<LandAsset>(LAND_KEY);
}

export function addLandAsset(asset: LandAsset) {
  const items = getAddedLandAssets();
  writeJson(LAND_KEY, [...items, asset]);
}

export function getAddedLiquidityAssets(): LiquidityAsset[] {
  return readJson<LiquidityAsset>(LIQUIDITY_KEY);
}

export function addLiquidityAsset(asset: LiquidityAsset) {
  const items = getAddedLiquidityAssets();
  writeJson(LIQUIDITY_KEY, [...items, asset]);
}

const VENDOR_KEY = "itam-added-vendors";

export function getAddedVendors(): Vendor[] {
  return readJson<Vendor>(VENDOR_KEY);
}

export function addVendor(vendor: Vendor) {
  const items = getAddedVendors();
  writeJson(VENDOR_KEY, [...items, vendor]);
}
