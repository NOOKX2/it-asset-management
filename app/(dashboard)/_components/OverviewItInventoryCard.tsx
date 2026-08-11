import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CardShell, formatCompactM, SectionHeader } from "./overview-ui";
import type { OverviewMetrics } from "./use-overview-metrics";

const healthColors = {
  optimal: "bg-[var(--primary-green)]",
  maintenance: "bg-[#8fb85a]",
  critical: "bg-red-400",
};

export function OverviewItInventoryCard({ metrics }: { metrics: OverviewMetrics }) {
  const { t } = useLocale();

  const healthLabels = {
    optimal: t.overview.healthOptimal,
    maintenance: t.overview.healthMaintenance,
    critical: t.overview.healthCritical,
  };

  return (
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
          {
            label: t.overview.totalItValue,
            value: formatCompactM(metrics.itPurchaseValue),
          },
          {
            label: t.overview.totalDevices,
            value: metrics.itDeviceCount.toLocaleString(),
          },
          {
            label: t.overview.avgLifespan,
            value:
              metrics.itDeviceCount > 0 && Number.isFinite(metrics.avgLifespan)
                ? `${metrics.avgLifespan.toFixed(1)} ${t.overview.years}`
                : "—",
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
      {metrics.itDeviceCount === 0 ? (
        <p className="text-sm text-gray-500">{t.overview.noItAssets}</p>
      ) : (
        <>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-100">
            {metrics.healthBreakdown.map((seg) => (
              <div
                key={seg.key}
                className={`${healthColors[seg.key as keyof typeof healthColors]} h-full`}
                style={{ width: `${seg.pct}%` }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            {metrics.healthBreakdown.map((seg) => (
              <span key={seg.key}>
                <span
                  className={`inline-block h-2 w-2 rounded-full ${healthColors[seg.key as keyof typeof healthColors]} mr-1`}
                />
                {seg.pct}% {healthLabels[seg.key as keyof typeof healthLabels]}
              </span>
            ))}
          </div>
        </>
      )}
    </CardShell>
  );
}
