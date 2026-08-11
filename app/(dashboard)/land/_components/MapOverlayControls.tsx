"use client";

import type { Messages } from "@/lib/i18n/types";
import { type AssetTypeFilter, HEATMAP_COLORS } from "@/lib/thailand-provinces";

function formatCompactBaht(amount: number) {
  if (amount >= 1_000_000_000) {
    return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `฿${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `฿${(amount / 1_000).toFixed(0)}K`;
}

export function AssetTypeFilterControl({
  value,
  onChange,
  offsetTop,
  t,
}: {
  value: AssetTypeFilter;
  onChange: (value: AssetTypeFilter) => void;
  offsetTop: boolean;
  t: Messages["land"];
}) {
  return (
    <div
      className={`absolute left-3 z-20 flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-2 py-1.5 shadow-md sm:left-5 sm:gap-2 sm:px-3 sm:py-2 ${
        offsetTop ? "top-16" : "top-3 sm:top-5"
      }`}
    >
      <span className="text-xs font-medium text-gray-600 sm:text-sm">
        {t.assetTypeFilter}
      </span>
      <select
        className="rounded-lg border-0 bg-transparent py-0.5 text-xs font-semibold text-gray-900 outline-none focus:ring-0 sm:py-1 sm:text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value as AssetTypeFilter)}
        aria-label={t.assetTypeFilter}
      >
        <option value="all">{t.filterAll}</option>
        <option value="in_use">{t.statusInUse}</option>
        <option value="for_rent">{t.statusForRent}</option>
        <option value="vacant">{t.statusVacant}</option>
        <option value="bank_mortgage">{t.statusMortgage}</option>
      </select>
    </div>
  );
}

const TOTALS_CARD_CLASS =
  "flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-2.5 py-1.5 shadow-md sm:flex-none sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3";
const TOTALS_ICON_CLASS =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--light-green-bg)] text-[var(--primary-green)] sm:h-10 sm:w-10 sm:rounded-xl";
const TOTALS_SVG_CLASS = "h-4 w-4 sm:h-5 sm:w-5";
const TOTALS_LABEL_CLASS = "truncate text-[10px] leading-tight text-gray-500 sm:text-xs";
const TOTALS_VALUE_CLASS = "text-sm font-bold leading-tight sm:text-lg";

export function MapTotalsCards({
  totalValue,
  totalRai,
  offsetTop,
  t,
  raiLabel,
}: {
  totalValue: number;
  totalRai: number;
  offsetTop: boolean;
  t: Messages["land"];
  raiLabel: string;
}) {
  return (
    <div
      className={`absolute inset-x-3 z-20 flex gap-2 sm:inset-x-auto sm:right-5 sm:top-5 sm:gap-3 ${
        offsetTop ? "top-28" : "top-16"
      }`}
    >
      <div className={TOTALS_CARD_CLASS}>
        <div className={TOTALS_ICON_CLASS}>
          <svg className={TOTALS_SVG_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className={TOTALS_LABEL_CLASS}>{t.totalAssetValue}</p>
          <p className={`${TOTALS_VALUE_CLASS} text-[var(--primary-green)]`}>
            {formatCompactBaht(totalValue)}
          </p>
        </div>
      </div>

      <div className={TOTALS_CARD_CLASS}>
        <div className={TOTALS_ICON_CLASS}>
          <svg className={TOTALS_SVG_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className={TOTALS_LABEL_CLASS}>{t.totalArea}</p>
          <p className={`${TOTALS_VALUE_CLASS} text-gray-900`}>
            {Math.round(totalRai)} {raiLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HeatmapLegend({ t }: { t: Messages["land"] }) {
  return (
    <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-md lg:block">
      <p className="mb-3 text-xs font-semibold text-gray-700">{t.heatmapLegend}</p>
      <div className="flex flex-col gap-1">
        <div className="h-5 w-full rounded-sm" style={{ background: HEATMAP_COLORS.max }} />
        <div className="h-5 w-full rounded-sm" style={{ background: HEATMAP_COLORS.high }} />
        <div className="h-5 w-full rounded-sm" style={{ background: "#a8d67a" }} />
        <div className="h-5 w-full rounded-sm" style={{ background: HEATMAP_COLORS.low }} />
        <div className="h-5 w-full rounded-sm" style={{ background: HEATMAP_COLORS.none }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-gray-500">
        <span>{t.legendMin}</span>
        <span>{t.legendMax}</span>
      </div>
    </div>
  );
}

export function MapZoomControls({
  onZoomIn,
  onZoomOut,
  onRecenter,
  t,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  t: Messages["land"];
}) {
  return (
    <div className="absolute bottom-6 left-5 z-20 flex items-center gap-1 rounded-full border border-gray-200/80 bg-white p-1 shadow-md">
      <button
        type="button"
        onClick={onZoomIn}
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        aria-label={t.zoomIn}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        aria-label={t.zoomOut}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onRecenter}
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        aria-label="Recenter"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
}
