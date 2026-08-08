"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MOCK_LAND_ASSETS } from "@/lib/land-types";
import { MOCK_LIQUIDITY_ASSETS } from "@/lib/liquidity-types";
import { formatBaht } from "@/lib/format-currency";

function formatCompactM(amount: number) {
  if (amount >= 1_000_000_000) return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(1)}K`;
  return `฿${amount}`;
}

export function AnalysisContent() {
  const { locale, t } = useLocale();

  const landValue = MOCK_LAND_ASSETS.reduce((s, a) => s + a.purchasePrice, 0);
  const liquidityValue = MOCK_LIQUIDITY_ASSETS.reduce((s, a) => s + a.assetsValue, 0);

  const categoryData = [
    { label: t.analysis.categoryLand, value: 65, color: "bg-[var(--primary-green)]" },
    { label: t.analysis.categoryLiquidity, value: 25, color: "bg-[#8fb85a]" },
    { label: t.analysis.categoryIt, value: 8, color: "bg-[#c5ddb0]" },
    { label: t.analysis.categoryOther, value: 2, color: "bg-gray-300" },
  ];

  const summaryCards = [
    { label: t.analysis.landPortfolio, value: formatCompactM(landValue), change: "+12.5%" },
    { label: t.analysis.liquidityPortfolio, value: formatCompactM(liquidityValue), change: "+8.2%" },
    { label: t.analysis.avgRoi, value: "10.4%", change: "+1.2%" },
    { label: t.analysis.riskScore, value: t.analysis.stable, change: t.analysis.stable },
  ];

  const landStatuses = useMemo(() => {
    const counts = {
      in_use: 0,
      for_rent: 0,
      vacant: 0,
      bank_mortgage: 0,
    };
    for (const a of MOCK_LAND_ASSETS) {
      counts[a.landStatus]++;
    }
    return [
      { status: t.analysis.statusInUse, count: counts.in_use },
      { status: t.analysis.statusForRent, count: counts.for_rent },
      { status: t.analysis.statusVacant, count: counts.vacant },
      { status: t.analysis.statusMortgage, count: counts.bank_mortgage },
    ];
  }, [t.analysis]);

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
            <p className="mt-1 text-xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-0.5 text-xs text-green-600">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Charts — grow to fill upper half */}
      <div className="grid min-h-0 grid-cols-1 gap-3 lg:grid-cols-2">
        <div className={cardCls}>
          <h3 className="mb-3 shrink-0 text-sm font-semibold text-gray-900">
            {t.analysis.distributionTitle}
          </h3>
          <div className="flex min-h-0 flex-1 flex-col justify-between gap-2">
            {categoryData.map((cat) => (
              <div key={cat.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{cat.label}</span>
                  <span className="font-medium">{cat.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full ${cat.color}`}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

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

      {/* Bottom — grow to fill lower half */}
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

        <div className={cardCls}>
          <h3 className="mb-3 shrink-0 text-sm font-semibold text-gray-900">
            {t.analysis.liquidityPerfTitle}
          </h3>
          <div className="min-h-0 flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500">
                  <th className="pb-2">{t.analysis.colAsset}</th>
                  <th className="pb-2">{t.analysis.colCost}</th>
                  <th className="pb-2">{t.analysis.colCurrent}</th>
                  <th className="pb-2">{t.analysis.colGainLoss}</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LIQUIDITY_ASSETS.map((a) => {
                  const diff = a.currentPrice - a.costPrice;
                  const pct = ((diff / a.costPrice) * 100).toFixed(1);
                  return (
                    <tr key={a.id} className="border-t border-gray-100">
                      <td className="max-w-[7rem] truncate py-2.5 pr-2">{a.securityType}</td>
                      <td className="py-2.5">{formatBaht(a.costPrice, locale)}</td>
                      <td className="py-2.5">{formatBaht(a.currentPrice, locale)}</td>
                      <td
                        className={`py-2.5 font-medium ${diff >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {diff >= 0 ? "+" : ""}{pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
