"use client";

import { useCallback, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getAssetStatusLabel } from "@/lib/update-labels";
import {
  MOCK_UPDATABLE_ASSETS,
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

const LOCATIONS = [
  "Bangkok HQ",
  "Chiang Mai Branch",
  "Data Center A",
  "Sukhumvit, Bangkok",
];

export default function UpdateAssetsPage() {
  const { t } = useLocale();
  const [assets, setAssets] = useState<UpdatableAsset[]>(MOCK_UPDATABLE_ASSETS);
  const [selected, setSelected] = useState<UpdatableAsset | null>(null);
  const [form, setForm] = useState<UpdatableAsset | null>(null);

  const openEdit = (asset: UpdatableAsset) => {
    setSelected(asset);
    setForm({ ...asset });
  };

  const closeEdit = () => {
    setSelected(null);
    setForm(null);
  };

  const handleSave = useCallback(() => {
    if (!form) return;
    setAssets((prev) => prev.map((a) => (a.id === form.id ? form : a)));
    closeEdit();
  }, [form]);

  const activities = [
    {
      user: "Michael T.",
      action: t.update.updatedStatus,
      asset: "LT-2023-041",
      time: `2 ${t.update.minutesAgo}`,
    },
    {
      user: "Sarah K.",
      action: t.update.assigned,
      asset: "MON-045",
      time: `15 ${t.update.minutesAgo}`,
    },
    {
      user: "IT Operations",
      action: t.update.flaggedRepair,
      asset: "SRV-NY-012",
      time: `1 ${t.update.hourAgo}`,
    },
  ];

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
          <p className="text-2xl font-bold text-gray-900">2,451</p>
          <p className="text-sm text-gray-500">{t.update.totalAssets}</p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] border-l-4 border-l-[var(--primary-green-dark)] bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">128</p>
          <p className="text-sm text-gray-500">{t.update.recentUpdates}</p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] border-l-4 border-l-red-400 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">34</p>
          <p className="text-sm text-gray-500">{t.update.underReview}</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
          <div className="flex flex-wrap gap-3 border-b border-[var(--card-border)] px-4 py-3">
            <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              <option>{t.update.filterAllTypes}</option>
              <option>{t.update.filterLand}</option>
              <option>{t.update.filterLaptop}</option>
              <option>{t.update.filterServer}</option>
            </select>
            <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              <option>{t.update.filterAllStatuses}</option>
              {STATUS_KEYS.map((k) => (
                <option key={k} value={k}>
                  {getAssetStatusLabel(k, t.update)}
                </option>
              ))}
            </select>
            <input
              type="search"
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
                <th className="px-4 py-3">{t.update.colAction}</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {form && selected && (
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
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-green)]"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
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

      <div className="mt-6 rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          {t.update.activityTitle}
        </h3>
        <div className="space-y-3">
          {activities.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--light-green-bg)] text-[var(--primary-green)]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">{item.user}</span>{" "}
                {item.action}{" "}
                <span className="font-medium text-[var(--primary-green)]">{item.asset}</span>
              </p>
              <span className="ml-auto text-xs text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
