"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { getAssetStatusLabel } from "@/lib/update-labels";
import type { AssetStatus, UpdatableAsset } from "@/lib/update-types";
import { STATUS_KEYS } from "./update-constants";

type UpdateEditPanelProps = {
  selected: UpdatableAsset;
  form: UpdatableAsset;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: UpdatableAsset) => void;
};

export function UpdateEditPanel({
  selected,
  form,
  onClose,
  onSave,
  onFormChange,
}: UpdateEditPanelProps) {
  const { t } = useLocale();

  return (
    <div className="w-full shrink-0 rounded-2xl border border-[var(--card-border)] bg-white shadow-lg lg:w-80">
      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-4">
        <h2 className="text-sm font-semibold">
          {t.update.editTitle}: {selected.id}
        </h2>
        <button
          type="button"
          onClick={onClose}
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
            onChange={(e) => onFormChange({ ...form, assignedTo: e.target.value })}
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
            onChange={(e) => onFormChange({ ...form, location: e.target.value })}
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
              onFormChange({ ...form, status: e.target.value as AssetStatus })
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
            onChange={(e) => onFormChange({ ...form, warrantyExpiry: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-green)]"
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-[var(--card-border)] px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {t.common.cancel}
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex-1 rounded-xl bg-[var(--primary-green)] py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-green-dark)]"
        >
          {t.common.save}
        </button>
      </div>
    </div>
  );
}
