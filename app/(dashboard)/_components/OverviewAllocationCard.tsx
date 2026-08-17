import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCanEdit } from "@/lib/hooks/use-can-edit";
import { CardShell, formatCompactM, SectionHeader } from "./overview-ui";
import type { OverviewMetrics } from "./use-overview-metrics";

const SEGMENT_COLORS: Record<string, string> = {
  stocks: "#ff6b1a",
  gold: "#eab308",
  bonds: "#1e2d4d",
  cash: "#0d9488",
  loans: "#e11d48",
};

export function OverviewAllocationCard({ metrics }: { metrics: OverviewMetrics }) {
  const { t } = useLocale();
  const canEdit = useCanEdit();

  const rows = metrics.liquiditySegments
    .map((seg) => ({
      key: seg.key,
      label:
        seg.key === "stocks"
          ? t.overview.stocks
          : seg.key === "bonds"
            ? t.overview.bonds
            : seg.key === "cash"
              ? t.overview.cash
              : seg.key === "loans"
                ? t.overview.loans
                : t.overview.gold,
      value: seg.value,
      color: SEGMENT_COLORS[seg.key] ?? seg.color,
    }))
    .filter((row) => row.value > 0);

  const maxValue = Math.max(...rows.map((row) => row.value), 1);

  return (
    <CardShell>
      <SectionHeader
        title={t.overview.assetAllocation}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
          </svg>
        }
        action={
          canEdit ? (
            <Link
              href="/assets/new"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              + {t.sidebar.addAsset}
            </Link>
          ) : undefined
        }
      />

      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">{t.overview.emptyAllocation}</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.key}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-gray-800">{row.label}</span>
                <span className="text-sm font-semibold tabular-nums text-gray-900">
                  {formatCompactM(row.value)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max((row.value / maxValue) * 100, 4)}%`,
                    backgroundColor: row.color,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}
