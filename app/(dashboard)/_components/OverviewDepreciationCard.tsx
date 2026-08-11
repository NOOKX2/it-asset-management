import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CardShell, SectionHeader } from "./overview-ui";
import type { OverviewMetrics } from "./use-overview-metrics";

export function OverviewDepreciationCard({ metrics }: { metrics: OverviewMetrics }) {
  const { t } = useLocale();

  return (
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
        {metrics.depreciationPoints.every((point) => point === 0) ? (
          <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-gray-500">
            {t.overview.noDepreciationData}
          </div>
        ) : (
          <>
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
                points={`0,100 ${metrics.depreciationPoints.map((point, i) => {
                  const x =
                    (i / (metrics.depreciationPoints.length - 1)) * 300;
                  const y = 100 - (point / 100) * 85;
                  return `${x},${y}`;
                }).join(" ")} 300,100`}
              />
              <polyline
                fill="none"
                stroke="#4b6f1c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={metrics.depreciationPoints
                  .map((point, i) => {
                    const x =
                      (i / (metrics.depreciationPoints.length - 1)) * 300;
                    const y = 100 - (point / 100) * 85;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            </svg>
          </>
        )}
      </div>
    </CardShell>
  );
}
