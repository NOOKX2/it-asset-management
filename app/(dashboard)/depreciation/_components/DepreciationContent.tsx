"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useLandAssets } from "@/lib/hooks/use-land-assets";
import { useUpdatableAssets } from "@/lib/hooks/use-updatable-assets";
import { formatBaht, formatBahtCompact } from "@/lib/format-currency";
import { SummaryKpiCard, SummaryKpiGrid } from "../../_components/SummaryKpiCard";
import {
  isItAsset,
  toDepreciationRow,
} from "@/lib/asset-depreciation";

export function DepreciationContent() {
  const { locale, t } = useLocale();
  const { assets: landAssets, isLoading: landLoading } = useLandAssets();
  const { assets: updatableAssets, isLoading: updatableLoading } = useUpdatableAssets();

  const { allRows, totals } = useMemo(() => {
    const landRows = landAssets.map((asset) => ({
      id: asset.id,
      name: asset.location,
      purchase: asset.purchasePrice,
      annual: 0,
      accumulated: 0,
      book: asset.purchasePrice,
      rate: "N/A",
    }));

    const itRows = updatableAssets
      .filter(isItAsset)
      .map(toDepreciationRow);

    const allRows = [...landRows, ...itRows];

    return {
      allRows,
      totals: {
        purchase: allRows.reduce((sum, row) => sum + row.purchase, 0),
        accumulated: allRows.reduce((sum, row) => sum + row.accumulated, 0),
        book: allRows.reduce((sum, row) => sum + row.book, 0),
      },
    };
  }, [landAssets, updatableAssets]);

  const isLoading = landLoading || updatableLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Loading depreciation data…
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{t.depreciation.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.depreciation.subtitle}</p>
      </div>

      <SummaryKpiGrid>
        <SummaryKpiCard
          label={t.depreciation.totalPurchase}
          value={formatBahtCompact(totals.purchase)}
          fullValue={formatBaht(totals.purchase, locale)}
        />
        <SummaryKpiCard
          label={t.depreciation.accumulated}
          value={formatBahtCompact(totals.accumulated)}
          fullValue={formatBaht(totals.accumulated, locale)}
          valueClassName="text-red-600"
        />
        <SummaryKpiCard
          label={t.depreciation.netBook}
          value={formatBahtCompact(totals.book)}
          fullValue={formatBaht(totals.book, locale)}
          valueClassName="text-[var(--primary-green)]"
        />
      </SummaryKpiGrid>

      <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
        {allRows.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-gray-500">
            {t.depreciation.empty}
          </p>
        ) : (
          <>
            <div className="divide-y divide-[var(--card-border)] md:hidden">
              {allRows.map((row) => (
                <div key={row.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--primary-green)]">{row.id}</p>
                      <p className="mt-0.5 text-sm text-gray-900">{row.name}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {row.rate}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <dt className="text-sm font-semibold text-gray-900">
                        {t.depreciation.colPurchase}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-gray-500">
                        {formatBaht(row.purchase, locale)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-900">
                        {t.depreciation.colAnnual}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-gray-500">
                        {row.annual > 0 ? formatBaht(row.annual, locale) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-900">
                        {t.depreciation.colAccumulated}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-red-500">
                        {row.accumulated > 0 ? formatBaht(row.accumulated, locale) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-900">
                        {t.depreciation.colBook}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--primary-green-dark)]">
                        {formatBaht(row.book, locale)}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--card-border)] bg-gray-50 text-left text-xs font-medium text-gray-500">
                    <th className="px-4 py-3">{t.depreciation.colId}</th>
                    <th className="px-4 py-3">{t.depreciation.colDescription}</th>
                    <th className="px-4 py-3">{t.depreciation.colPurchase}</th>
                    <th className="px-4 py-3">{t.depreciation.colAnnual}</th>
                    <th className="px-4 py-3">{t.depreciation.colAccumulated}</th>
                    <th className="px-4 py-3">{t.depreciation.colBook}</th>
                    <th className="px-4 py-3">{t.depreciation.colRate}</th>
                  </tr>
                </thead>
                <tbody>
                  {allRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-[var(--card-border)] hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--primary-green)]">
                        {row.id}
                      </td>
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3">{formatBaht(row.purchase, locale)}</td>
                      <td className="px-4 py-3">
                        {row.annual > 0 ? formatBaht(row.annual, locale) : "—"}
                      </td>
                      <td className="px-4 py-3 text-red-600">
                        {row.accumulated > 0 ? formatBaht(row.accumulated, locale) : "—"}
                      </td>
                      <td className="px-4 py-3 font-medium">{formatBaht(row.book, locale)}</td>
                      <td className="px-4 py-3">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
