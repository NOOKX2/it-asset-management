import { useLocale } from "@/components/providers/LocaleProvider";
import { CardShell, formatCompactM } from "./overview-ui";
import type { OverviewMetrics } from "./use-overview-metrics";

export function OverviewKpiBar({ metrics }: { metrics: OverviewMetrics }) {
  const { t } = useLocale();

  return (
    <CardShell className="shrink-0 p-0">
      <div className="grid grid-cols-2 divide-y divide-[var(--card-border)] lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        <div className="px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {t.overview.kpiNetBookValue}
          </p>
          <p className="text-2xl font-bold leading-tight text-[var(--primary-green)]">
            {formatCompactM(metrics.netBookValue)}
          </p>
        </div>
        <div className="px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {t.overview.kpiItAssets}
          </p>
          <p className="text-2xl font-bold leading-tight text-gray-900">
            {metrics.itActiveCount.toLocaleString()}
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
  );
}
