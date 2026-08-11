"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { formatBaht } from "@/lib/format-currency";
import { getLandCategoryLabel, formatShowingRange } from "@/lib/land-table";
import { getLandStatusLabel } from "@/lib/land-labels";
import type { LandAsset } from "@/lib/land-types";
import { getStatusBadgeClass } from "./land-table-utils";

type LandTableBodyProps = {
  assets: LandAsset[];
  pageRows: LandAsset[];
  pageStart: number;
  totalAssets: number;
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  canEdit: boolean;
  getAssetProvince: (asset: LandAsset) => string;
  onEdit: (id: string) => void;
  onPageChange: (page: number) => void;
};

export function LandTableBody({
  assets,
  pageRows,
  pageStart,
  totalAssets,
  filteredCount,
  currentPage,
  totalPages,
  canEdit,
  getAssetProvince,
  onEdit,
  onPageChange,
}: LandTableBodyProps) {
  const { locale, t } = useLocale();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] bg-gray-50 text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">{t.land.colNo}</th>
              <th className="px-4 py-3">{t.land.colAssetName}</th>
              <th className="px-4 py-3">{t.land.colProvince}</th>
              <th className="px-4 py-3">{t.land.colArea}</th>
              <th className="px-4 py-3">{t.land.colAppraisalValue}</th>
              <th className="px-4 py-3">{t.land.colStatus}</th>
              <th className="px-4 py-3 text-right">{t.land.colActions}</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                  {totalAssets === 0 ? t.land.empty : t.land.emptyFilter}
                </td>
              </tr>
            ) : (
              pageRows.map((asset, index) => (
                <tr
                  key={asset.id}
                  className="border-t border-[var(--card-border)] hover:bg-gray-50"
                >
                  <td className="px-4 py-4 text-gray-500">
                    {pageStart + index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{asset.location}</p>
                    <p className="text-xs text-gray-500">
                      {getLandCategoryLabel(asset, t.land)}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {getAssetProvince(asset)}
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {asset.sizeRai} {t.common.rai}
                    {asset.sizeNgan > 0 ? ` ${asset.sizeNgan} ${t.addAsset.sizeNgan}` : ""}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {formatBaht(asset.purchasePrice, locale)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                        asset.landStatus
                      )}`}
                    >
                      {getLandStatusLabel(asset.landStatus, t.land)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(asset.id)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[var(--primary-green)]"
                        aria-label={t.land.editAsset}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredCount > 0 && (
        <div className="flex flex-col gap-3 border-t border-[var(--card-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            {formatShowingRange(
              t.land.showingRange,
              pageStart + 1,
              Math.min(pageStart + 5, filteredCount),
              filteredCount
            )}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Previous page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                  p === currentPage
                    ? "bg-[var(--primary-green)] text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Next page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
