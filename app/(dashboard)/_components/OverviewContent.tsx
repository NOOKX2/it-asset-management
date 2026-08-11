"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { useLandAssets } from "@/lib/hooks/use-land-assets";
import { useLiquidityAssets } from "@/lib/hooks/use-liquidity-assets";
import { useUpdatableAssets } from "@/lib/hooks/use-updatable-assets";
import { OverviewDepreciationCard } from "./OverviewDepreciationCard";
import { OverviewItInventoryCard } from "./OverviewItInventoryCard";
import { OverviewKpiBar } from "./OverviewKpiBar";
import { OverviewLandCard } from "./OverviewLandCard";
import { OverviewLiquidityCard } from "./OverviewLiquidityCard";
import { useOverviewMetrics } from "./use-overview-metrics";

export function OverviewContent() {
  const { t } = useLocale();
  const { assets: landAssets, isLoading: landLoading } = useLandAssets();
  const { assets: liquidityAssets, isLoading: liquidityLoading } = useLiquidityAssets();
  const { assets: updatableAssets, isLoading: updatableLoading } = useUpdatableAssets();

  const metrics = useOverviewMetrics(landAssets, liquidityAssets, updatableAssets);
  const isLoading = landLoading || liquidityLoading || updatableLoading;

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Loading overview…
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-3 lg:h-full lg:overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900">{t.overview.title}</h1>
          <p className="text-sm text-gray-500">{t.overview.subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <select
            className="min-w-0 flex-1 rounded-md border border-[var(--card-border)] bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[var(--primary-green)] sm:flex-none"
            defaultValue="all"
          >
            <option value="all">{t.overview.allLocations}</option>
          </select>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[var(--primary-green)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-green-dark)] sm:flex-none"
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

      <OverviewKpiBar metrics={metrics} />

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-3">
        <OverviewItInventoryCard metrics={metrics} />
        <OverviewLiquidityCard metrics={metrics} />
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-2">
        <OverviewLandCard metrics={metrics} />
        <OverviewDepreciationCard metrics={metrics} />
      </div>
    </div>
  );
}
