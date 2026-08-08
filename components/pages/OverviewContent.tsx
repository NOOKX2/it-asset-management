"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MOCK_LAND_ASSETS } from "@/lib/land-types";
import { MOCK_LIQUIDITY_ASSETS } from "@/lib/liquidity-types";

function formatCompactM(amount: number) {
  if (amount >= 1_000_000_000) return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(1)}K`;
  return `฿${amount}`;
}

const IT_VALUE = 12_400_000;
const IT_DEVICES = 1500;
const IT_LIFESPAN = 3.2;
const IT_ACTIVE_COUNT = 1248;
const DEPRECIATION_POINTS = [100, 88, 76, 64, 52, 40];

function CardShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-[var(--card-border)] bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--light-green-bg)] text-[var(--primary-green)]">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function OverviewContent() {
  const { t } = useLocale();

  const metrics = useMemo(() => {
    const landValue = MOCK_LAND_ASSETS.reduce((s, a) => s + a.purchasePrice, 0);
    const landRai = Math.round(
      MOCK_LAND_ASSETS.reduce((s, a) => s + a.sizeRai + a.sizeNgan / 4, 0)
    );
    const liquidityTotal = MOCK_LIQUIDITY_ASSETS.reduce(
      (s, a) => s + a.assetsValue,
      0
    );

    let stocks = 0;
    let bonds = 0;
    let gold = 0;
    for (const a of MOCK_LIQUIDITY_ASSETS) {
      const type = a.securityType.toLowerCase();
      if (type.includes("gold") || type.includes("ทอง")) gold += a.assetsValue;
      else if (type.includes("bond") || type.includes("พันธบัตร"))
        bonds += a.assetsValue;
      else stocks += a.assetsValue;
    }

    const netBookValue = landValue + liquidityTotal + IT_VALUE * 0.85;

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

    return {
      landValue,
      landRai,
      liquidityTotal,
      netBookValue,
      liquiditySegments,
      donutGradient: `conic-gradient(${gradientParts.join(", ")})`,
    };
  }, []);

  const healthSegments = [
    { label: t.overview.healthOptimal, pct: 75, color: "bg-[var(--primary-green)]" },
    { label: t.overview.healthMaintenance, pct: 15, color: "bg-[#8fb85a]" },
    { label: t.overview.healthCritical, pct: 10, color: "bg-red-400" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900">{t.overview.title}</h1>
          <p className="text-sm text-gray-500">{t.overview.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <select
            className="rounded-md border border-[var(--card-border)] bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[var(--primary-green)]"
            defaultValue="all"
          >
            <option value="all">{t.overview.allLocations}</option>
          </select>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-[var(--primary-green)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-green-dark)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {t.overview.exportReport}
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <CardShell className="shrink-0 p-0">
        <div className="grid divide-x divide-[var(--card-border)] lg:grid-cols-4">
          <div className="px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.overview.kpiNetBookValue}
            </p>
            <p className="text-2xl font-bold leading-tight text-[var(--primary-green)]">
              {formatCompactM(metrics.netBookValue)}
            </p>
            <p className="text-xs font-medium text-green-600">
              ↗ {t.overview.kpiNetBookTrend}
            </p>
          </div>
          <div className="px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.overview.kpiItAssets}
            </p>
            <p className="text-2xl font-bold leading-tight text-gray-900">
              {IT_ACTIVE_COUNT.toLocaleString()}
            </p>
          </div>
          <div className="px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.overview.kpiLandValue}
            </p>
            <p className="text-2xl font-bold leading-tight text-gray-900">
              {formatCompactM(metrics.landValue)}
            </p>
          </div>
          <div className="px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.overview.kpiLiquidityValue}
            </p>
            <p className="text-2xl font-bold leading-tight text-gray-900">
              {formatCompactM(metrics.liquidityTotal)}
            </p>
          </div>
        </div>
      </CardShell>

      {/* Middle row */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-3">
        <CardShell className="lg:col-span-2">
          <SectionHeader
            title={t.overview.itInventory}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
            action={
              <Link
                href="/update"
                className="text-xs font-medium text-[var(--primary-green)] hover:underline"
              >
                {t.overview.viewAll}
              </Link>
            }
          />

          <div className="mb-3 grid grid-cols-3 gap-2">
            {[
              { label: t.overview.totalItValue, value: formatCompactM(IT_VALUE) },
              { label: t.overview.totalDevices, value: IT_DEVICES.toLocaleString() },
              {
                label: t.overview.avgLifespan,
                value: `${IT_LIFESPAN} ${t.overview.years}`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-[var(--card-border)] bg-gray-50 px-3 py-2.5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                <p className="text-base font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {t.overview.healthBreakdown}
          </p>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-100">
            {healthSegments.map((seg) => (
              <div
                key={seg.label}
                className={`${seg.color} h-full`}
                style={{ width: `${seg.pct}%` }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            {healthSegments.map((seg) => (
              <span key={seg.label}>
                <span className={`inline-block h-2 w-2 rounded-full ${seg.color} mr-1`} />
                {seg.pct}% {seg.label}
              </span>
            ))}
          </div>
        </CardShell>

        <CardShell>
          <SectionHeader
            title={t.overview.liquidityOverview}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
          />

          <div className="flex items-center gap-4 py-2">
            <div
              className="relative h-24 w-24 shrink-0 rounded-full"
              style={{ background: metrics.donutGradient }}
            >
              <div className="absolute inset-3.5 flex flex-col items-center justify-center rounded-full bg-white">
                <span className="text-[10px] text-gray-500">{t.overview.total}</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCompactM(metrics.liquidityTotal)}
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              {metrics.liquiditySegments.map((seg) => {
                const labelKey =
                  seg.key === "stocks"
                    ? t.overview.stocks
                    : seg.key === "bonds"
                      ? t.overview.bonds
                      : t.overview.gold;
                return (
                  <div
                    key={seg.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-gray-600">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                      {labelKey}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCompactM(seg.value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardShell>
      </div>

      {/* Bottom row */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-2">
        <CardShell className="flex min-h-0 flex-col">
          <SectionHeader
            title={t.overview.landAssetsCard}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            }
            action={
              <Link
                href="/land"
                className="text-xs font-medium text-[var(--primary-green)] hover:underline"
              >
                {t.overview.viewAll}
              </Link>
            }
          />

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-[#e8f5e0] to-[#c5ddb0]">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px)",
              }}
            />
            <div className="absolute left-[45%] top-[40%] h-16 w-16 rounded-full bg-[#4b6f1c]/30 blur-xl" />

            <div className="relative flex flex-wrap gap-3 p-4">
              <div className="rounded-md border border-white/60 bg-white/95 px-4 py-2.5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t.overview.totalAreaLabel}
                </p>
                <p className="text-base font-bold text-gray-900">
                  {metrics.landRai} {t.common.rai}
                </p>
              </div>
              <div className="rounded-md border border-white/60 bg-white/95 px-4 py-2.5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t.overview.currentValuation}
                </p>
                <p className="text-base font-bold text-[var(--primary-green)]">
                  {formatCompactM(metrics.landValue)}
                  <span className="ml-1.5 text-xs font-medium text-green-600">
                    ({t.overview.ytdGain})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardShell>

        <CardShell className="flex min-h-0 flex-col">
          <SectionHeader
            title={t.overview.depreciationForecast}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            }
            action={
              <Link
                href="/depreciation"
                className="text-xs font-medium text-[var(--primary-green)] hover:underline"
              >
                {t.overview.viewAll}
              </Link>
            }
          />

          <div className="relative min-h-0 flex-1 w-full">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-dashed border-gray-200"
                style={{ top: `${i * 33}%` }}
              />
            ))}
            <svg
              viewBox="0 0 300 100"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="depFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4b6f1c" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4b6f1c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#depFill)"
                points={`0,100 ${DEPRECIATION_POINTS.map((p, i) => {
                  const x = (i / (DEPRECIATION_POINTS.length - 1)) * 300;
                  const y = 100 - (p / 100) * 85;
                  return `${x},${y}`;
                }).join(" ")} 300,100`}
              />
              <polyline
                fill="none"
                stroke="#4b6f1c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={DEPRECIATION_POINTS.map((p, i) => {
                  const x = (i / (DEPRECIATION_POINTS.length - 1)) * 300;
                  const y = 100 - (p / 100) * 85;
                  return `${x},${y}`;
                }).join(" ")}
              />
            </svg>
          </div>
        </CardShell>
      </div>
    </div>
  );
}
