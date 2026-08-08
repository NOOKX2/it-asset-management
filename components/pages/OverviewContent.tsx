"use client";

import Link from "next/link";
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

function formatCompact(amount: number, locale: string) {
  if (amount >= 1_000_000_000) return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  return formatBaht(amount, locale);
}

export function OverviewContent() {
  const { locale, t } = useLocale();

  const landTotal = MOCK_LAND_ASSETS.reduce((s, a) => s + a.purchasePrice, 0);
  const liquidityTotal = MOCK_LIQUIDITY_ASSETS.reduce(
    (s, a) => s + a.assetsValue,
    0
  );
  const totalValue = landTotal + liquidityTotal;

  const kpiCards = [
    {
      label: t.overview.kpiTotalAssets,
      value: "2,451",
      sub: t.overview.kpiTotalAssetsSub,
      color: "border-l-[var(--primary-green)]",
    },
    {
      label: t.overview.kpiLand,
      value: String(MOCK_LAND_ASSETS.length),
      sub: t.overview.kpiLandSub,
      color: "border-l-[#6b8e23]",
    },
    {
      label: t.overview.kpiLiquidity,
      value: String(MOCK_LIQUIDITY_ASSETS.length),
      sub: t.overview.kpiLiquiditySub,
      color: "border-l-[#8fb85a]",
    },
    {
      label: t.overview.kpiRecent,
      value: "128",
      sub: t.overview.kpiRecentSub,
      color: "border-l-[#4b6f1c]",
    },
    {
      label: t.overview.kpiReview,
      value: "34",
      sub: t.overview.kpiReviewSub,
      color: "border-l-red-400",
    },
  ];

  const filters = [
    t.overview.filterAllTypes,
    t.overview.filterLand,
    t.overview.filterLiquidity,
    t.overview.filterIt,
  ];

  const quickLinks = [
    { href: "/land", label: t.overview.quickLand, desc: t.overview.quickLandDesc },
    { href: "/liquidity", label: t.overview.quickLiquidity, desc: t.overview.quickLiquidityDesc },
    { href: "/update", label: t.overview.quickUpdate, desc: t.overview.quickUpdateDesc },
    { href: "/analysis", label: t.overview.quickAnalysis, desc: t.overview.quickAnalysisDesc },
  ];

  const charts = [
    t.overview.chartDistribution,
    t.overview.chartTrend,
    t.overview.chartHeatmap,
  ];

  return (
    <>
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[var(--primary-green-dark)] to-[var(--primary-green)] px-8 py-6 text-center text-white shadow-md">
        <h1 className="text-xl font-semibold tracking-wide">
          {t.overview.bannerTitle}
        </h1>
        <p className="mt-1 text-sm text-white/80">{t.overview.bannerSubtitle}</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.overview.title}</h2>
          <p className="mt-1 text-sm text-gray-500">{t.overview.subtitle}</p>
        </div>
        <p className="text-3xl font-bold text-[var(--primary-green)]">
          {formatBaht(totalValue, locale)}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <select
            key={filter}
            className="rounded-xl border border-[var(--light-green)] bg-[var(--light-green-bg)] px-4 py-2 text-sm text-[var(--primary-green-dark)] outline-none focus:border-[var(--primary-green)]"
            defaultValue={filter}
          >
            <option value={filter}>{filter}</option>
          </select>
        ))}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border border-[var(--card-border)] border-l-4 bg-white p-5 shadow-sm ${card.color}`}
          >
            <p className="text-2xl font-bold text-[var(--primary-green)]">{card.value}</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{card.label}</p>
            <p className="text-xs text-gray-500">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {t.overview.breakdownTitle}
          </h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">{t.overview.breakdownLand}</span>
                <span className="font-medium">{formatCompact(landTotal, locale)}</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full bg-[var(--primary-green)]"
                  style={{ width: `${(landTotal / totalValue) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">{t.overview.breakdownLiquidity}</span>
                <span className="font-medium">{formatCompact(liquidityTotal, locale)}</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full bg-[#8fb85a]"
                  style={{ width: `${(liquidityTotal / totalValue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {t.overview.quickNavTitle}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-[var(--card-border)] p-4 transition-colors hover:border-[var(--primary-green)] hover:bg-[var(--light-green-bg)]"
              >
                <p className="font-medium text-[var(--primary-green-dark)]">{link.label}</p>
                <p className="text-xs text-gray-500">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {charts.map((title) => (
          <div
            key={title}
            className="flex h-48 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-white shadow-sm"
          >
            <p className="text-sm text-gray-400">{title} {t.common.chart}</p>
          </div>
        ))}
      </div>
    </>
  );
}
