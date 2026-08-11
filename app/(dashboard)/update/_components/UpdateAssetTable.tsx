"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { getAssetStatusLabel } from "@/lib/update-labels";
import type { UpdatableAsset } from "@/lib/update-types";
import { STATUS_KEYS, STATUS_STYLES } from "./update-constants";

type UpdateAssetTableProps = {
  assets: UpdatableAsset[];
  filteredAssets: UpdatableAsset[];
  assetTypes: string[];
  typeFilter: string;
  statusFilter: string;
  searchQuery: string;
  canEdit: boolean;
  onTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
  onEdit: (asset: UpdatableAsset) => void;
};

export function UpdateAssetTable({
  assets,
  filteredAssets,
  assetTypes,
  typeFilter,
  statusFilter,
  searchQuery,
  canEdit,
  onTypeFilterChange,
  onStatusFilterChange,
  onSearchQueryChange,
  onEdit,
}: UpdateAssetTableProps) {
  const { t } = useLocale();

  return (
    <div className="flex-1 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
      <div className="flex flex-wrap gap-3 border-b border-[var(--card-border)] px-4 py-3">
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          <option value="">{t.update.filterAllTypes}</option>
          {assetTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          <option value="">{t.update.filterAllStatuses}</option>
          {STATUS_KEYS.map((k) => (
            <option key={k} value={k}>
              {getAssetStatusLabel(k, t.update)}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder={t.update.searchPlaceholder}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        />
      </div>

      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-[var(--card-border)] bg-gray-50 text-left text-[11px] font-medium text-gray-500 sm:text-xs">
            <th className="px-2 py-2.5 sm:px-4 sm:py-3">{t.update.colId}</th>
            <th className="px-2 py-2.5 sm:px-4 sm:py-3">{t.update.colType}</th>
            <th className="px-2 py-2.5 sm:px-4 sm:py-3">{t.update.colAssigned}</th>
            <th className="px-2 py-2.5 whitespace-nowrap sm:px-4 sm:py-3">{t.update.colStatus}</th>
            {canEdit && <th className="px-2 py-2.5 sm:px-4 sm:py-3">{t.update.colAction}</th>}
          </tr>
        </thead>
        <tbody>
          {filteredAssets.length === 0 ? (
            <tr>
              <td
                colSpan={canEdit ? 5 : 4}
                className="px-2 py-8 text-center text-gray-500 sm:px-4"
              >
                {assets.length === 0
                  ? t.update.emptyAssets
                  : t.update.emptyFilter}
              </td>
            </tr>
          ) : (
            filteredAssets.map((asset) => (
              <tr
                key={asset.id}
                className="border-t border-[var(--card-border)] hover:bg-gray-50"
              >
                <td className="px-2 py-2.5 font-medium text-[var(--primary-green)] sm:px-4 sm:py-3">
                  {asset.id}
                </td>
                <td className="px-2 py-2.5 sm:px-4 sm:py-3">{asset.type}</td>
                <td className="px-2 py-2.5 sm:px-4 sm:py-3">{asset.assignedTo}</td>
                <td className="px-2 py-2.5 sm:px-4 sm:py-3">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-medium sm:px-3 sm:text-xs ${STATUS_STYLES[asset.status]}`}
                  >
                    {getAssetStatusLabel(asset.status, t.update)}
                  </span>
                </td>
                {canEdit && (
                  <td className="px-2 py-2.5 sm:px-4 sm:py-3">
                    <button
                      type="button"
                      onClick={() => onEdit(asset)}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-[var(--light-green-bg)] hover:text-[var(--primary-green)]"
                      aria-label={`${t.common.edit} ${asset.id}`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
