"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useLandAssets } from "@/lib/hooks/use-land-assets";
import { useUpdatableAssets } from "@/lib/hooks/use-updatable-assets";
import { formatBaht } from "@/lib/format-currency";
import {
  computeDepreciationForecastPoints,
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
        <h1 className="text-2xl font-bold text-gray-900">{t.depreciation.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.depreciation.subtitle}</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">{t.depreciation.totalPurchase}</p>
          <p className="text-xl font-bold text-gray-900">
            {formatBaht(totals.purchase, locale)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">{t.depreciation.accumulated}</p>
          <p className="text-xl font-bold text-red-600">
            {formatBaht(totals.accumulated, locale)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">{t.depreciation.netBook}</p>
          <p className="text-xl font-bold text-[var(--primary-green)]">
            {formatBaht(totals.book, locale)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
        <table className="w-full text-sm">
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
            {allRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {t.depreciation.empty}
                </td>
              </tr>
            ) : (
              allRows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--card-border)] hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[var(--primary-green)]">{row.id}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
