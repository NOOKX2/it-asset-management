"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export function UpdateStatsCards({
  total,
  recentUpdates,
  underReview,
}: {
  total: number;
  recentUpdates: number;
  underReview: number;
}) {
  const { t } = useLocale();

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.update.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.update.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm text-green-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          {t.update.liveSync}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="min-w-0 rounded-2xl border border-[var(--card-border)] border-l-4 border-l-[var(--primary-green)] bg-white p-3 shadow-sm sm:p-5">
          <p className="text-xs leading-snug text-gray-500 sm:text-sm">{t.update.totalAssets}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-gray-900 sm:mt-2 sm:text-2xl">
            {total}
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-[var(--card-border)] border-l-4 border-l-[var(--primary-green-dark)] bg-white p-3 shadow-sm sm:p-5">
          <p className="text-xs leading-snug text-gray-500 sm:text-sm">{t.update.recentUpdates}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-gray-900 sm:mt-2 sm:text-2xl">
            {recentUpdates}
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-[var(--card-border)] border-l-4 border-l-red-400 bg-white p-3 shadow-sm sm:p-5">
          <p className="text-xs leading-snug text-gray-500 sm:text-sm">{t.update.underReview}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-red-600 sm:mt-2 sm:text-2xl">
            {underReview}
          </p>
        </div>
      </div>
    </>
  );
}
