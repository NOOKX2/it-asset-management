"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { formatBahtCompact } from "@/lib/format-currency";

type Slice = {
  label: string;
  value: number;
  color: string;
};

export function AnalysisAllocationChart({
  slices,
  largestName,
  largestPct,
}: {
  slices: Slice[];
  largestName: string | null;
  largestPct: number;
}) {
  const { t } = useLocale();
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const visible = slices.filter((slice) => slice.value > 0);

  let cursor = 0;
  const gradient =
    visible.length > 0
      ? `conic-gradient(${visible
          .map((slice) => {
            const start = cursor;
            const pct = (slice.value / total) * 100;
            cursor += pct;
            return `${slice.color} ${start}% ${cursor}%`;
          })
          .join(", ")})`
      : "conic-gradient(#e5e7eb 0% 100%)";

  return (
    <div className="flex min-h-0 flex-col rounded-2xl border border-[var(--card-border)] bg-white p-4 shadow-sm">
      <h3 className="mb-3 shrink-0 text-sm font-semibold text-gray-900">
        {t.analysis.distributionTitle}
      </h3>

      {total <= 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">{t.analysis.noHoldings}</p>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className="relative mx-auto h-36 w-36 shrink-0 rounded-full"
            style={{ background: gradient }}
            aria-hidden
          >
            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white text-center">
              <span className="text-[10px] text-gray-500">{t.overview.total}</span>
              <span className="text-sm font-bold text-gray-900">{formatBahtCompact(total)}</span>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            {visible.map((slice) => {
              const pct = Math.round((slice.value / total) * 100);
              return (
                <div key={slice.label} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2 text-gray-600">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="truncate">{slice.label}</span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                    {pct}%
                  </span>
                </div>
              );
            })}

            {largestName ? (
              <div className="rounded-xl bg-[var(--light-green-bg)] px-3 py-2">
                <p className="text-[11px] font-medium text-gray-500">
                  {t.analysis.largestHolding}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[var(--primary-green-dark)]">
                  {t.analysis.largestHoldingShare
                    .replace("{name}", largestName)
                    .replace("{pct}", String(largestPct))}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
