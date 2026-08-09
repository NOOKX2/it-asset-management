"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
import { formatBaht } from "@/lib/format-currency";

interface AssetDetailsFormProps {
  asset: LandAsset;
  onSave: (asset: LandAsset) => void;
  onClose?: () => void;
  variant?: "card" | "panel";
  readOnly?: boolean;
}

export function AssetDetailsForm({
  asset,
  onSave,
  onClose,
  variant = "card",
  readOnly = false,
}: AssetDetailsFormProps) {
  const { locale, t } = useLocale();
  const [form, setForm] = useState<LandAsset>(asset);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(asset);
    setSaved(false);
  }, [asset]);

  const isPanel = variant === "panel";

  const updateField = <K extends keyof LandAsset>(key: K, value: LandAsset[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = useCallback(() => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [form, onSave]);

  const handleCancel = () => {
    if (onClose) {
      onClose();
      return;
    }
    setForm(asset);
    setSaved(false);
  };

  return (
    <div
      className={`flex flex-col bg-white ${
        isPanel
          ? "h-full"
          : "rounded-2xl border border-[var(--card-border)] shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">{t.land.assetDetails}</h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--light-green)] px-3 py-1 text-xs font-medium text-[var(--primary-green-dark)]">
            {t.land.selected}: {form.id}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label={t.common.close}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <fieldset
        disabled={readOnly}
        className="flex-1 overflow-y-auto border-0 p-5 disabled:opacity-100"
      >
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

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            {t.land.size}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              value={form.sizeRai}
              onChange={(e) =>
                updateField("sizeRai", Number(e.target.value))
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-[var(--primary-green)]"
              placeholder={t.common.rai}
            />
            <input
              type="number"
              min={0}
              max={3}
              value={form.sizeNgan}
              onChange={(e) =>
                updateField("sizeNgan", Number(e.target.value))
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-[var(--primary-green)]"
              placeholder="Ngan"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            {t.land.owner}
          </label>
          <input
            type="text"
            value={form.owner}
            onChange={(e) => updateField("owner", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
          />
        </div>

        <div className="relative mb-5 h-44 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={form.imageUrl}
            alt={`${t.land.assetDetails} ${form.id}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            {t.land.images}
          </label>
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
            <div>
              <svg
                className="mx-auto h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">{t.land.uploadHint}</p>
              <button
                type="button"
                className="mt-2 text-sm font-medium text-[var(--primary-green)] hover:underline"
              >
                {t.land.chooseFile}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            {t.land.description}
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
            placeholder={t.land.descriptionPlaceholder}
          />
        </div>

        <div className="rounded-xl bg-[var(--light-green-bg)] p-3 text-sm">
          <span className="text-gray-600">{t.land.currentValue} </span>
          <span className="font-semibold text-[var(--primary-green-dark)]">
            {formatBaht(form.purchasePrice * 1.15, locale)}
          </span>
        </div>
      </fieldset>

      {!readOnly && (
      <div className="flex items-center justify-between border-t border-[var(--card-border)] px-5 py-4">
        {saved && (
          <span className="text-sm text-[var(--primary-green)]">{t.land.saved}</span>
        )}
        <div className="flex flex-1 justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-[var(--primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-green-dark)]"
          >
            {t.common.save}
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
