import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CardShell, formatCompactM, SectionHeader } from "./overview-ui";
import type { OverviewMetrics } from "./use-overview-metrics";

export function OverviewLandCard({ metrics }: { metrics: OverviewMetrics }) {
  const { t } = useLocale();

  return (
    <CardShell className="flex min-h-0 flex-col">
      <SectionHeader
        title={t.overview.landAssetsCard}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        }
        action={
          <Link
            href="/land"
            className="text-xs font-medium text-[var(--primary-green)] hover:underline"
          >
            {t.overview.viewAll}
          </Link>
        }
      />

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-[#e8f5e0] to-[#c5ddb0]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px)",
          }}
        />
        <div className="absolute left-[45%] top-[40%] h-16 w-16 rounded-full bg-[#4b6f1c]/30 blur-xl" />

        <div className="relative flex flex-wrap gap-3 p-4">
          <div className="rounded-md border border-white/60 bg-white/95 px-4 py-2.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.overview.totalAreaLabel}
            </p>
            <p className="text-base font-bold text-gray-900">
              {metrics.landRai} {t.common.rai}
            </p>
          </div>
          <div className="rounded-md border border-white/60 bg-white/95 px-4 py-2.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.overview.currentValuation}
            </p>
            <p className="text-base font-bold text-[var(--primary-green)]">
              {formatCompactM(metrics.landValue)}
            </p>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
