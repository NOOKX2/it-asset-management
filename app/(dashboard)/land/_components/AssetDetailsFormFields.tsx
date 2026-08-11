"use client";


import { useLocale } from "@/components/providers/LocaleProvider";
import {
  getImprovementLabel,
  getLandStatusLabel,
} from "@/lib/land-labels";
import type { LandAsset } from "@/lib/land-types";
import {
  IMPROVEMENT_OPTIONS,
  LAND_STATUS_OPTIONS,
} from "@/lib/land-types";

import type { AssetFieldUpdater } from "./AssetDetailsFormParts";

export function AssetDetailsFormFields({
  form,
  updateField,
}: {
  form: LandAsset;
  updateField: AssetFieldUpdater;
}) {
  const { t } = useLocale();

  return (
  <>
    <div className="mb-5">
      <label className="mb-1.5 block text-xs font-medium text-gray-500">
        {t.land.purchasePrice}
      </label>
      <input
        type="number"
        min={0}
        value={form.purchasePrice}
        onChange={(e) =>
          updateField("purchasePrice", Number(e.target.value))
        }
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-[var(--primary-green)] outline-none focus:border-[var(--primary-green)]"
      />
    </div>

    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-medium text-gray-500">
        {t.land.location}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
          placeholder={t.land.locationPlaceholder}
        />
        <a
          href={form.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-[var(--primary-green)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-green-dark)]"
        >
          {t.land.viewOnMap}
        </a>
      </div>
      <input
        type="url"
        value={form.googleMapsUrl}
        onChange={(e) => updateField("googleMapsUrl", e.target.value)}
        className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 outline-none focus:border-[var(--primary-green)]"
        placeholder="https://maps.google.com/..."
      />
    </div>

    <div className="mb-4 grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          {t.land.landStatus}
        </label>
        <select
          value={form.landStatus}
          onChange={(e) =>
            updateField(
              "landStatus",
              e.target.value as LandAsset["landStatus"]
            )
          }
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
        >
          {LAND_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {getLandStatusLabel(opt.value, t.land)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          {t.land.improvementStatus}
        </label>
        <select
          value={form.improvementStatus}
          onChange={(e) =>
            updateField(
              "improvementStatus",
              e.target.value as LandAsset["improvementStatus"]
            )
          }
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
        >
          {IMPROVEMENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {getImprovementLabel(opt.value, t.land)}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-medium text-gray-500">
        {t.land.buildings}
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => updateField("hasStructures", true)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            form.hasStructures
              ? "bg-[var(--light-green)] text-[var(--primary-green-dark)]"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {t.land.hasStructures}
        </button>
        <button
          type="button"
          onClick={() => updateField("hasStructures", false)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            !form.hasStructures
              ? "bg-[var(--light-green)] text-[var(--primary-green-dark)]"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {t.land.noStructures}
        </button>
      </div>
    </div>

    <div className="mb-4">
      <p className="mb-2 text-xs font-semibold text-gray-700">
        {t.land.titleDeed}
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t.land.deedNumber}</label>
          <input
            type="number"
            min={0}
            value={form.titleDeedNumber}
            onChange={(e) => updateField("titleDeedNumber", e.target.value)}
            className="no-spin w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-green)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t.land.deedBook}</label>
          <input
            type="number"
            min={0}
            value={form.titleDeedBook}
            onChange={(e) => updateField("titleDeedBook", e.target.value)}
            className="no-spin w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-green)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t.land.deedPage}</label>
          <input
            type="number"
            min={0}
            value={form.titleDeedPage}
            onChange={(e) => updateField("titleDeedPage", e.target.value)}
            className="no-spin w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-green)]"
          />
        </div>
      </div>
    </div>
  </>
  );
}
