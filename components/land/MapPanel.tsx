"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { LandAsset } from "@/lib/land-types";

interface MapPanelProps {
  assets: LandAsset[];
  selectedId: string | null;
  onSelectAsset: (id: string) => void;
  totalValue: number;
  totalRai: number;
  panelOpen: boolean;
}

function formatCompactBaht(amount: number) {
  if (amount >= 1_000_000_000) {
    return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `฿${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `฿${(amount / 1_000).toFixed(0)}K`;
}

const DISTRICT_BARS = [
  { label: "Bangkok", pct: 72 },
  { label: "Central", pct: 48 },
  { label: "North", pct: 35 },
  { label: "East", pct: 28 },
];

export function MapPanel({
  assets,
  selectedId,
  onSelectAsset,
  totalValue,
  totalRai,
  panelOpen,
}: MapPanelProps) {
  const { t } = useLocale();

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#dfe8d4]">
      {/* City map base */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(232,245,224,0.3) 0%, rgba(197,221,176,0.5) 100%), repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.35) 39px, rgba(255,255,255,0.35) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.35) 39px, rgba(255,255,255,0.35) 40px)",
        }}
      />

      {/* Heatmap blobs */}
      <div className="absolute left-[38%] top-[28%] h-56 w-56 rounded-full bg-[#4b6f1c]/25 blur-3xl" />
      <div className="absolute left-[48%] top-[35%] h-40 w-40 rounded-full bg-[#6b8e23]/35 blur-2xl" />
      <div className="absolute left-[55%] top-[42%] h-32 w-32 rounded-full bg-[#8fb85a]/40 blur-xl" />
      <div className="absolute left-[42%] top-[48%] h-24 w-24 rounded-full bg-[#4b6f1c]/20 blur-xl" />

      {/* Floating title card */}
      <div className="absolute left-5 top-5 z-20 max-w-xs rounded-2xl border border-white/60 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
        <h1 className="text-lg font-bold text-gray-900">{t.land.title}</h1>
        <p className="mt-0.5 text-xs text-gray-500">{t.land.subtitle}</p>
        {!panelOpen && (
          <p className="mt-2 text-xs text-[var(--primary-green-dark)]">
            {t.land.selectMarkerHint}
          </p>
        )}
      </div>

      {/* Map mode + stats */}
      <div className="absolute right-5 top-5 z-20 flex flex-col gap-3 sm:flex-row sm:items-start">
        <select
          className="rounded-xl border border-white/60 bg-white/95 px-4 py-2 text-sm font-medium text-[var(--primary-green-dark)] shadow-lg outline-none backdrop-blur-sm focus:border-[var(--primary-green)]"
          defaultValue="heatmap"
        >
          <option value="heatmap">{t.land.heatmap}</option>
          <option value="markers">{t.land.markers}</option>
          <option value="density">{t.land.density}</option>
        </select>

        <div className="flex gap-2">
          <div className="rounded-xl border border-white/60 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-wide text-gray-500">
              {t.land.totalValue}
            </p>
            <p className="text-sm font-bold text-[var(--primary-green)]">
              {formatCompactBaht(totalValue)}
            </p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-wide text-gray-500">
              {t.land.totalArea}
            </p>
            <p className="text-sm font-bold text-gray-900">
              {Math.round(totalRai)} {t.common.rai}
            </p>
          </div>
        </div>
      </div>

      {/* Asset markers */}
      {assets.map((asset) => {
        const isSelected = selectedId === asset.id;
        const valLabel = formatCompactBaht(asset.purchasePrice);
        return (
          <button
            key={asset.id}
            type="button"
            onClick={() => onSelectAsset(asset.id)}
            className="absolute z-20 -translate-x-1/2 transition-transform hover:scale-105"
            style={{ left: `${asset.mapX}%`, top: `${asset.mapY}%` }}
            aria-label={`${t.land.selectAsset} ${asset.id}`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold shadow-md transition-colors ${
                  isSelected
                    ? "bg-[var(--primary-green)] text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {asset.id}
              </div>
              <div
                className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg transition-all ${
                  isSelected
                    ? "border-white bg-[var(--primary-green)] ring-4 ring-[var(--primary-green)]/30"
                    : "border-[var(--primary-green)] bg-white"
                }`}
              >
                <svg
                  className={`h-5 w-5 ${isSelected ? "text-white" : "text-[var(--primary-green)]"}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div
                className={`mt-1 rounded-md px-2 py-0.5 text-[10px] font-bold shadow-sm ${
                  isSelected
                    ? "bg-[var(--primary-green-dark)] text-white"
                    : "bg-white/95 text-[var(--primary-green-dark)]"
                }`}
              >
                {t.land.assetVal} {valLabel}
              </div>
            </div>
          </button>
        );
      })}

      {/* Distribution chart */}
      <div className="absolute bottom-24 left-5 z-20 w-52 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold text-gray-700">
          {t.land.distributionByDistrict}
        </p>
        <div className="space-y-2">
          {DISTRICT_BARS.map((d) => (
            <div key={d.label}>
              <div className="mb-0.5 flex justify-between text-[10px] text-gray-500">
                <span>{d.label}</span>
                <span>{d.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-[var(--primary-green)]"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-5 left-5 z-20 rounded-xl border border-white/60 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <p className="mb-2 text-xs font-medium text-gray-700">{t.land.valueDensity}</p>
        <div className="flex items-center gap-1">
          <div className="h-3 w-10 rounded bg-[#d9e8c5]" />
          <div className="h-3 w-10 rounded bg-[#8fb85a]" />
          <div className="h-3 w-10 rounded bg-[#4b6f1c]" />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-gray-500">
          <span>{t.common.low}</span>
          <span>{t.common.high}</span>
        </div>
      </div>

      {/* Zoom controls — center bottom */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/60 bg-white/95 p-1 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          aria-label={t.land.zoomIn}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          aria-label={t.land.zoomOut}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          aria-label="Recenter"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Add asset FAB */}
      <Link
        href="/update"
        className={`absolute bottom-5 z-20 flex items-center gap-2 rounded-full bg-[var(--primary-green)] px-5 py-3 text-sm font-semibold text-white shadow-xl transition-all hover:bg-[var(--primary-green-dark)] ${
          panelOpen ? "right-[calc(min(420px,40vw)+1.25rem)]" : "right-5"
        }`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {t.sidebar.addAsset}
      </Link>
    </div>
  );
}
