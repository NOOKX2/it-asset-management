import { useLocale } from "@/components/providers/LocaleProvider";
import { CardShell, formatCompactM, SectionHeader } from "./overview-ui";
import type { OverviewMetrics } from "./use-overview-metrics";

export function OverviewLiquidityCard({ metrics }: { metrics: OverviewMetrics }) {
  const { t } = useLocale();

  return (
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
  );
}
