import { useMemo } from "react";
import type { LandAsset } from "@/lib/land-types";
import { getLiquidityKind } from "@/lib/liquidity-kind";
import type { LiquidityAsset } from "@/lib/liquidity-types";

export function useOverviewMetrics(
  landAssets: LandAsset[],
  liquidityAssets: LiquidityAsset[]
) {
  return useMemo(() => {
    const landValue = landAssets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
    const landRai = Math.round(
      landAssets.reduce((sum, asset) => sum + asset.sizeRai + asset.sizeNgan / 4, 0)
    );
    const liquidityTotal = liquidityAssets.reduce(
      (sum, asset) => sum + asset.assetsValue,
      0
    );

    let stocks = 0;
    let bonds = 0;
    let gold = 0;
    let cash = 0;
    let loans = 0;
    for (const asset of liquidityAssets) {
      const kind = getLiquidityKind(asset.securityType);
      if (kind === "gold") gold += asset.assetsValue;
      else if (kind === "bond") bonds += asset.assetsValue;
      else if (kind === "cash") cash += asset.assetsValue;
      else if (kind === "loan") loans += asset.assetsValue;
      else stocks += asset.assetsValue;
    }

    const netBookValue = landValue + liquidityTotal;

    const liquiditySegments = [
      { key: "stocks", value: stocks, color: "#ff6b1a" },
      { key: "bonds", value: bonds, color: "#1e2d4d" },
      { key: "gold", value: gold, color: "#eab308" },
      { key: "cash", value: cash, color: "#0d9488" },
      { key: "loans", value: loans, color: "#e11d48" },
    ];

    return {
      landValue,
      landRai,
      liquidityTotal,
      netBookValue,
      liquiditySegments,
    };
  }, [landAssets, liquidityAssets]);
}

export type OverviewMetrics = ReturnType<typeof useOverviewMetrics>;
