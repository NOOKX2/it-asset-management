"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatCompactBaht } from "./land-table-utils";

export function LandTableSummary({
  totalValue,
  totalRai,
}: {
  totalValue: number;
  totalRai: number;
}) {
  const { t } = useLocale();

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.land.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.land.subtitle}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--light-green-bg)] text-[var(--primary-green)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">{t.land.totalValue}</p>
            <p className="text-lg font-bold text-[var(--primary-green)]">
              {formatCompactBaht(totalValue)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--light-green-bg)] text-[var(--primary-green)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">{t.land.totalArea}</p>
            <p className="text-lg font-bold text-gray-900">
              {Math.round(totalRai)} {t.common.rai}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandTableToolbar({
  search,
  onSearchChange,
  provinceFilter,
  onProvinceFilterChange,
  provinceOptions,
  canEdit,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  provinceFilter: string;
  onProvinceFilterChange: (value: string) => void;
  provinceOptions: { code: string; name: string }[];
  canEdit: boolean;
}) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-3 border-b border-[var(--card-border)] p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-md">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.topNav.search}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
          />
        </div>
        <select
          value={provinceFilter}
          onChange={(e) => onProvinceFilterChange(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
          aria-label={t.land.colProvince}
        >
          <option value="all">{t.land.filterAllProvinces}</option>
          {provinceOptions.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {canEdit && (
        <Link
          href="/assets/new"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--primary-green)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-green-dark)]"
        >
          + {t.sidebar.addAsset}
        </Link>
      )}
    </div>
  );
}
