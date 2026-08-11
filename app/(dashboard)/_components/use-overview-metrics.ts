import { useMemo } from "react";
import {
  computeDepreciation,
  computeDepreciationForecastPoints,
  computeHealthBreakdown,
  getAssetAgeYears,
  isItAsset,
} from "@/lib/asset-depreciation";
import type { LandAsset } from "@/lib/land-types";
import type { LiquidityAsset } from "@/lib/liquidity-types";
import type { UpdatableAsset } from "@/lib/update-types";

export function useOverviewMetrics(
  landAssets: LandAsset[],
  liquidityAssets: LiquidityAsset[],
  updatableAssets: UpdatableAsset[]
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
    for (const asset of liquidityAssets) {
      const type = asset.securityType.toLowerCase();
      if (type.includes("gold") || type.includes("ทอง")) gold += asset.assetsValue;
      else if (type.includes("bond") || type.includes("พันธบัตร"))
        bonds += asset.assetsValue;
      else stocks += asset.assetsValue;
    }

    const itAssets = updatableAssets.filter(isItAsset);
    const itPurchaseValue = itAssets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
    const itBookValue = itAssets.reduce((sum, asset) => {
      const ageYears = getAssetAgeYears(asset.createdAt);
      return (
        sum +
        computeDepreciation(
          asset.purchasePrice,
          asset.depreciationRatePercent,
          asset.usefulLifeYears,
          ageYears
        ).book
      );
    }, 0);
    const itAnnualDepreciation = itAssets.reduce((sum, asset) => {
      const ageYears = getAssetAgeYears(asset.createdAt);
      return (
        sum +
        computeDepreciation(
          asset.purchasePrice,
          asset.depreciationRatePercent,
          asset.usefulLifeYears,
          ageYears
        ).annual
      );
    }, 0);
    const itActiveCount = itAssets.filter((asset) => asset.status === "active").length;
    const avgLifespan =
      itAssets.length > 0
        ? itAssets.reduce((sum, asset) => sum + asset.usefulLifeYears, 0) / itAssets.length
        : 0;

    const netBookValue = landValue + liquidityTotal + itBookValue;

    const liquiditySegments = [
      { key: "stocks", value: stocks, color: "#4b6f1c" },
      { key: "bonds", value: bonds, color: "#6b8e23" },
      { key: "gold", value: gold, color: "#d9e8c5" },
    ];
    const liquidityTotalForChart = stocks + bonds + gold || 1;

    let gradientStart = 0;
    const gradientParts = liquiditySegments.map((seg) => {
      const pct = (seg.value / liquidityTotalForChart) * 100;
      const part = `${seg.color} ${gradientStart}% ${gradientStart + pct}%`;
      gradientStart += pct;
      return part;
    });

    const healthBreakdown = computeHealthBreakdown(updatableAssets);
    const depreciationPoints = computeDepreciationForecastPoints(
      [itBookValue],
      itAnnualDepreciation
    );

    return {
      landValue,
      landRai,
      liquidityTotal,
      netBookValue,
      liquiditySegments,
      donutGradient:
        liquidityTotal > 0
          ? `conic-gradient(${gradientParts.join(", ")})`
          : "conic-gradient(#e5e7eb 0% 100%)",
      itPurchaseValue,
      itDeviceCount: itAssets.length,
      avgLifespan,
      itActiveCount,
      healthBreakdown,
      depreciationPoints,
    };
  }, [landAssets, liquidityAssets, updatableAssets]);
}

export type OverviewMetrics = ReturnType<typeof useOverviewMetrics>;
