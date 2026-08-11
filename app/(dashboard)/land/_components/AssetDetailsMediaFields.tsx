"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { LandAsset } from "@/lib/land-types";
import { formatBaht } from "@/lib/format-currency";
import type { AssetFieldUpdater } from "./AssetDetailsFormParts";

export function AssetDetailsMediaFields({
  form,
  updateField,
}: {
  form: LandAsset;
  updateField: AssetFieldUpdater;
}) {
  const { locale, t } = useLocale();

  return (
  <>
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
  </>
  );
}
