"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { MOCK_LAND_ASSETS } from "@/lib/land-types";
import { MOCK_LIQUIDITY_ASSETS } from "@/lib/liquidity-types";

function formatBaht(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
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
    { label: t.analysis.landPortfolio, value: formatBaht(landValue, locale), change: "+12.5%" },
    { label: t.analysis.liquidityPortfolio, value: formatBaht(liquidityValue, locale), change: "+8.2%" },
    { label: t.analysis.avgRoi, value: "10.4%", change: "+1.2%" },
    { label: t.analysis.riskScore, value: t.analysis.stable, change: t.analysis.stable },
  ];

  const landStatuses = [
    { status: t.analysis.statusInUse, count: 1 },
    { status: t.analysis.statusForRent, count: 1 },
    { status: t.analysis.statusVacant, count: 1 },
    { status: t.analysis.statusMortgage, count: 0 },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.analysis.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.analysis.subtitle}</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm"
          >
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-1 text-xs text-green-600">{card.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {t.analysis.distributionTitle}
          </h3>
          <div className="space-y-3">
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

        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {t.analysis.trendTitle}
          </h3>
          <div className="flex h-48 items-end gap-2">
            {[40, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 92].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-[var(--light-green)] transition-colors hover:bg-[var(--primary-green)]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>{t.analysis.jan}</span>
            <span>{t.analysis.dec}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {t.analysis.landStatusTitle}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {landStatuses.map((item) => (
              <div
                key={item.status}
                className="rounded-xl bg-[var(--light-green-bg)] p-4 text-center"
              >
                <p className="text-2xl font-bold text-[var(--primary-green)]">
                  {item.count}
                </p>
                <p className="text-sm text-gray-600">{item.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {t.analysis.liquidityPerfTitle}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
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
                    <td className="py-2">{a.securityType}</td>
                    <td className="py-2">{formatBaht(a.costPrice, locale)}</td>
                    <td className="py-2">{formatBaht(a.currentPrice, locale)}</td>
                    <td
                      className={`py-2 font-medium ${diff >= 0 ? "text-green-600" : "text-red-600"}`}
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
    </>
  );
}
