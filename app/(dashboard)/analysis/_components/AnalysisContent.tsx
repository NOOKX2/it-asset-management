"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useLandAssets } from "@/lib/hooks/use-land-assets";
import { useLiquidityAssets } from "@/lib/hooks/use-liquidity-assets";
import { getLiquidityKind } from "@/lib/liquidity-kind";
import { AnalysisAllocationChart } from "./AnalysisAllocationChart";
import { AnalysisLiquidityTable } from "./AnalysisLiquidityTable";

function formatCompactM(amount: number) {
  if (amount >= 1_000_000_000) return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(1)}K`;
  return `฿${amount}`;
}

export function AnalysisContent() {
  const { t } = useLocale();
  const { assets: landAssets } = useLandAssets();
  const { assets: liquidityAssets } = useLiquidityAssets();

  const { landValue, goldValue, stocksValue, bondsValue, cashValue, loansValue, largest } = useMemo(() => {
    let goldValue = 0;
    let stocksValue = 0;
    let bondsValue = 0;
    let cashValue = 0;
    let loansValue = 0;

    for (const asset of liquidityAssets) {
      const kind = getLiquidityKind(asset.securityType);
      if (kind === "gold") goldValue += asset.assetsValue;
      else if (kind === "bond") bondsValue += asset.assetsValue;
      else if (kind === "cash") cashValue += asset.assetsValue;
      else if (kind === "loan") loansValue += asset.assetsValue;
      else stocksValue += asset.assetsValue;
    }

    const landValue = landAssets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
    const holdings = [
      ...landAssets.map((asset) => ({ name: asset.location, value: asset.purchasePrice })),
      ...liquidityAssets.map((asset) => ({
        name: asset.securityType,
        value: asset.assetsValue,
      })),
    ];
    const total = holdings.reduce((sum, item) => sum + item.value, 0);
    const top = holdings.sort((a, b) => b.value - a.value)[0];

    return {
      landValue,
      goldValue,
      stocksValue,
      bondsValue,
      cashValue,
      loansValue,
      largest: top && total > 0
        ? { name: top.name, pct: Math.round((top.value / total) * 100) }
        : null,
    };
  }, [landAssets, liquidityAssets]);

  const liquidityValue = goldValue + stocksValue + bondsValue + cashValue + loansValue;

  const slices = [
    { label: t.analysis.categoryLand, value: landValue, color: "#ff6b1a" },
    { label: t.overview.gold, value: goldValue, color: "#eab308" },
    { label: t.overview.stocks, value: stocksValue, color: "#1e2d4d" },
    { label: t.overview.bonds, value: bondsValue, color: "#ff9a54" },
    { label: t.overview.cash, value: cashValue, color: "#0d9488" },
    { label: t.overview.loans, value: loansValue, color: "#e11d48" },
  ];

  const summaryCards = [
    { label: t.analysis.landPortfolio, value: formatCompactM(landValue) },
    { label: t.analysis.liquidityPortfolio, value: formatCompactM(liquidityValue) },
    { label: t.analysis.avgRoi, value: "—" },
    { label: t.analysis.largestHolding, value: largest?.name ?? "—" },
  ];

  const landStatuses = useMemo(() => {
    const counts = {
      in_use: 0,
      for_rent: 0,
      vacant: 0,
      bank_mortgage: 0,
    };
    for (const a of landAssets) {
      counts[a.landStatus]++;
    }
    return [
      { status: t.analysis.statusInUse, count: counts.in_use },
      { status: t.analysis.statusForRent, count: counts.for_rent },
      { status: t.analysis.statusVacant, count: counts.vacant },
      { status: t.analysis.statusMortgage, count: counts.bank_mortgage },
    ];
  }, [landAssets, t.analysis]);

  const cardCls =
    "flex min-h-0 flex-col rounded-2xl border border-[var(--card-border)] bg-white p-4 shadow-sm";

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr_1fr] gap-3">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">{t.analysis.title}</h1>
        <p className="mt-0.5 text-sm text-gray-500">{t.analysis.subtitle}</p>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[var(--card-border)] bg-white p-4 shadow-sm"
          >
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="mt-1 truncate text-xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-3 lg:grid-cols-2">
        <AnalysisAllocationChart
          slices={slices}
          largestName={largest?.name ?? null}
          largestPct={largest?.pct ?? 0}
        />

        <div className={cardCls}>
          <h3 className="mb-3 shrink-0 text-sm font-semibold text-gray-900">
            {t.analysis.trendTitle}
          </h3>
          <div className="flex min-h-0 flex-1 items-end gap-1">
            {[40, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 92].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-[var(--light-green)] transition-colors hover:bg-[var(--primary-green)]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex shrink-0 justify-between text-xs text-gray-400">
            <span>{t.analysis.jan}</span>
            <span>{t.analysis.dec}</span>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-3 lg:grid-cols-2">
        <div className={cardCls}>
          <h3 className="mb-3 shrink-0 text-sm font-semibold text-gray-900">
            {t.analysis.landStatusTitle}
          </h3>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
            {landStatuses.map((item) => (
              <div
                key={item.status}
                className="flex min-h-0 flex-col items-center justify-center rounded-xl bg-[var(--light-green-bg)] px-2 py-3"
              >
                <p className="text-2xl font-bold text-[var(--primary-green)]">
                  {item.count}
                </p>
                <p className="mt-1 text-sm text-gray-600">{item.status}</p>
              </div>
            ))}
          </div>
        </div>

        <AnalysisLiquidityTable assets={liquidityAssets} className={cardCls} />
      </div>
    </div>
  );
}
