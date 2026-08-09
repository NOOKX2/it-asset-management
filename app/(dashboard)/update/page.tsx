"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useUpdatableAssets } from "@/lib/hooks/use-updatable-assets";
import { useCanEdit } from "@/lib/hooks/use-can-edit";
import { getAssetStatusLabel } from "@/lib/update-labels";
import {
  type AssetStatus,
  type UpdatableAsset,
} from "@/lib/update-types";

const STATUS_STYLES: Record<AssetStatus, string> = {
  active: "bg-green-100 text-green-700",
  needs_repair: "bg-red-100 text-red-700",
  storage: "bg-gray-100 text-gray-600",
  review: "bg-yellow-100 text-yellow-700",
};

const STATUS_KEYS: AssetStatus[] = [
  "active",
  "needs_repair",
  "storage",
  "review",
];

const RECENT_UPDATE_MS = 24 * 60 * 60 * 1000;

function isRecentUpdate(updatedAt: string | undefined): boolean {
  if (!updatedAt) return false;
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(updated)) return false;
  return Date.now() - updated <= RECENT_UPDATE_MS;
}

export default function UpdateAssetsPage() {
  const { t } = useLocale();
  const { assets, isLoading, updateAsset } = useUpdatableAssets();
  const canEdit = useCanEdit();
  const [selected, setSelected] = useState<UpdatableAsset | null>(null);
  const [form, setForm] = useState<UpdatableAsset | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const assetTypes = useMemo(
    () => [...new Set(assets.map((a) => a.type))].sort(),
    [assets]
  );

  const stats = useMemo(() => {
    const underReview = assets.filter((a) => a.status === "review").length;
    const recentUpdates = assets.filter((a) => isRecentUpdate(a.updatedAt)).length;
    return {
      total: assets.length,
      recentUpdates,
      underReview,
    };
  }, [assets]);

  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return assets.filter((asset) => {
      if (typeFilter && asset.type !== typeFilter) return false;
      if (statusFilter && asset.status !== statusFilter) return false;
      if (query && !asset.id.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [assets, typeFilter, statusFilter, searchQuery]);

  const openEdit = (asset: UpdatableAsset) => {
    setSelected(asset);
    setForm({ ...asset });
  };

  const closeEdit = () => {
    setSelected(null);
    setForm(null);
  };

  const handleSave = useCallback(async () => {
    if (!form) return;
    await updateAsset(form);
    closeEdit();
  }, [form, updateAsset]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Loading assets…
      </div>
    );
  }

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

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--card-border)] border-l-4 border-l-[var(--primary-green)] bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">{t.update.totalAssets}</p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] border-l-4 border-l-[var(--primary-green-dark)] bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{stats.recentUpdates}</p>
          <p className="text-sm text-gray-500">{t.update.recentUpdates}</p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] border-l-4 border-l-red-400 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
          <p className="text-sm text-gray-500">{t.update.underReview}</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
          <div className="flex flex-wrap gap-3 border-b border-[var(--card-border)] px-4 py-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            >
              <option value="">{t.update.filterAllTypes}</option>
              {assetTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.update.searchPlaceholder}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)] bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">{t.update.colId}</th>
                <th className="px-4 py-3">{t.update.colType}</th>
                <th className="px-4 py-3">{t.update.colAssigned}</th>
                <th className="px-4 py-3">{t.update.colStatus}</th>
                {canEdit && <th className="px-4 py-3">{t.update.colAction}</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td
                    colSpan={canEdit ? 5 : 4}
                    className="px-4 py-8 text-center text-gray-500"
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
                    <td className="px-4 py-3 font-medium text-[var(--primary-green)]">
                      {asset.id}
                    </td>
                    <td className="px-4 py-3">{asset.type}</td>
                    <td className="px-4 py-3">{asset.assignedTo}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[asset.status]}`}
                      >
                        {getAssetStatusLabel(asset.status, t.update)}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openEdit(asset)}
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

        {canEdit && form && selected && (
          <div className="w-80 shrink-0 rounded-2xl border border-[var(--card-border)] bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-4">
              <h2 className="text-sm font-semibold">
                {t.update.editTitle}: {selected.id}
              </h2>
              <button
                type="button"
                onClick={closeEdit}
                className="text-gray-400 hover:text-gray-600"
                aria-label={t.common.close}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t.update.assignedTo}
                </label>
                <input
                  type="text"
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-green)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t.update.location}
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-green)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t.update.status}
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as AssetStatus })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-green)]"
                >
                  {STATUS_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {getAssetStatusLabel(k, t.update)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t.update.warranty}
                </label>
                <input
                  type="date"
                  value={form.warrantyExpiry}
                  onChange={(e) => setForm({ ...form, warrantyExpiry: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-green)]"
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-[var(--card-border)] px-5 py-4">
              <button
                type="button"
                onClick={closeEdit}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-xl bg-[var(--primary-green)] py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-green-dark)]"
              >
                {t.common.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
