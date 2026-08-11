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
      className={`absolute z-20 flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-3 py-2 shadow-md ${
        offsetTop ? "left-5 top-16" : "left-5 top-5"
      }`}
    >
      <span className="text-sm font-medium text-gray-600">{t.assetTypeFilter}</span>
      <select
        className="rounded-lg border-0 bg-transparent py-1 text-sm font-semibold text-gray-900 outline-none focus:ring-0"
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

export function MapTotalsCards({
  totalValue,
  totalRai,
  t,
  raiLabel,
}: {
  totalValue: number;
  totalRai: number;
  t: Messages["land"];
  raiLabel: string;
}) {
  return (
    <div className="absolute right-5 top-5 z-20 flex flex-col gap-3 sm:flex-row">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white px-4 py-3 shadow-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--light-green-bg)] text-[var(--primary-green)]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t.totalAssetValue}</p>
          <p className="text-lg font-bold text-[var(--primary-green)]">
            {formatCompactBaht(totalValue)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white px-4 py-3 shadow-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--light-green-bg)] text-[var(--primary-green)]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t.totalArea}</p>
          <p className="text-lg font-bold text-gray-900">
            {Math.round(totalRai)} {raiLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HeatmapLegend({ t }: { t: Messages["land"] }) {
  return (
    <div className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-md">
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
