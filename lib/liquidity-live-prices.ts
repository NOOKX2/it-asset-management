import { goldWeightBaht, isGoldSecurity } from "@/lib/gold-price";
import { getLiquidityKind } from "@/lib/liquidity-kind";
import type { LiquidityAsset } from "@/lib/liquidity-types";

export function applyLiveAssetPrices(
  assets: LiquidityAsset[],
  goldBuyPerBaht: number | null | undefined,
  stockQuotes: Record<string, number>
): LiquidityAsset[] {
  return assets.map((asset) => {
    const kind = getLiquidityKind(asset.securityType);

    if (kind === "gold" && goldBuyPerBaht && goldBuyPerBaht > 0) {
      const weight = asset.goldWeightBaht > 0
        ? asset.goldWeightBaht
        : goldWeightBaht(asset, goldBuyPerBaht);
      if (!weight) return asset;
      const currentPrice = Math.round(weight * goldBuyPerBaht);
      return withCurrentPrice(asset, currentPrice);
    }

    if (kind === "stock") {
      const quote = stockQuotes[asset.symbol.trim().toUpperCase()];
      if (!quote || asset.quantity <= 0) return asset;
      return withCurrentPrice(asset, Math.round(asset.quantity * quote));
    }

    if (kind === "fund" && asset.navPerUnit > 0 && asset.quantity > 0) {
      return withCurrentPrice(asset, Math.round(asset.quantity * asset.navPerUnit));
    }

    return asset;
  });
}

function withCurrentPrice(asset: LiquidityAsset, currentPrice: number): LiquidityAsset {
  return {
    ...asset,
    currentPrice,
    moneyMarketValue: currentPrice,
    assetsValue: currentPrice + asset.debtorsValue - asset.creditorsValue,
  };
}

export function uniqueStockSymbols(assets: LiquidityAsset[]) {
  return [
    ...new Set(
      assets
        .filter((asset) => getLiquidityKind(asset.securityType) === "stock")
        .map((asset) => asset.symbol.trim().toUpperCase())
        .filter(Boolean)
    ),
  ];
}

export { isGoldSecurity };
