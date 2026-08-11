"use client";

import type { ReactNode } from "react";
import type { Messages } from "@/lib/i18n/types";

export type AssetCategory = "land" | "liquidity";

const CATEGORY_ICONS: Record<AssetCategory, ReactNode> = {
  land: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  ),
  liquidity: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
};

export function AssetCategoryPicker({
  category,
  onChange,
  a,
}: {
  category: AssetCategory;
  onChange: (category: AssetCategory) => void;
  a: Messages["addAsset"];
}) {
  const cards: { key: AssetCategory; label: string }[] = [
    { key: "land", label: a.categoryLand },
    { key: "liquidity", label: a.categoryLiquidity },
  ];

  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--light-green-bg)] text-[var(--primary-green)]">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </span>
        <h2 className="text-base font-semibold text-gray-900">{a.categoryTitle}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => {
          const selected = category === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onChange(card.key)}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                selected
                  ? "border-[var(--primary-green)] bg-[var(--light-green-bg)]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-[var(--primary-green)] text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {CATEGORY_ICONS[card.key]}
              </span>
              <span className="text-sm font-semibold text-gray-900">{card.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
