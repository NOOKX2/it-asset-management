"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatBaht } from "@/lib/format-currency";
import { getLandCategoryLabel, formatShowingRange } from "@/lib/land-table";
import { getLandStatusLabel } from "@/lib/land-labels";
import type { LandAsset, LandStatus } from "@/lib/land-types";
import type { ProvinceFeatureCollection } from "@/lib/thailand-provinces";
import {
  findProvinceCode,
  getProvinceName,
} from "@/lib/thailand-provinces";

const PAGE_SIZE = 5;

function formatCompactBaht(amount: number) {
  if (amount >= 1_000_000_000) {
    return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `฿${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `฿${(amount / 1_000).toFixed(0)}K`;
}

function getStatusBadgeClass(status: LandStatus): string {
  switch (status) {
    case "in_use":
      return "bg-green-100 text-green-700";
    case "for_rent":
      return "bg-[var(--light-green-bg)] text-[var(--primary-green-dark)]";
    case "vacant":
      return "bg-gray-100 text-gray-600";
    case "bank_mortgage":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

interface LandTableViewProps {
  assets: LandAsset[];
  onEdit: (id: string) => void;
  canEdit?: boolean;
}

export function LandTableView({ assets, onEdit, canEdit = true }: LandTableViewProps) {
  const { locale, t } = useLocale();
  const [geo, setGeo] = useState<ProvinceFeatureCollection | null>(null);
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    fetch("/geo/thailand-provinces.geojson")
      .then((res) => res.json())
      .then((data: ProvinceFeatureCollection) => {
        if (!cancelled) setGeo(data);
      })
      .catch(() => {
        if (!cancelled) setGeo(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const provinceOptions = useMemo(() => {
    if (!geo) return [];
    const codes = new Set<string>();
    for (const asset of assets) {
      const code = findProvinceCode(geo, asset.latitude, asset.longitude);
      if (code) codes.add(code);
    }
    return Array.from(codes)
      .map((code) => ({
        code,
        name: getProvinceName(geo, code, locale),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [assets, geo, locale]);

  const getAssetProvince = (asset: LandAsset): string => {
    if (!geo) return asset.location;
    const code = findProvinceCode(geo, asset.latitude, asset.longitude);
    if (!code) return asset.location;
    return getProvinceName(geo, code, locale);
  };

  const getAssetProvinceCode = (asset: LandAsset): string | null => {
    if (!geo) return null;
    return findProvinceCode(geo, asset.latitude, asset.longitude);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((asset) => {
      if (provinceFilter !== "all") {
        const code = getAssetProvinceCode(asset);
        if (code !== provinceFilter) return false;
      }
      if (!q) return true;
      const province = getAssetProvince(asset).toLowerCase();
      return (
        asset.id.toLowerCase().includes(q) ||
        asset.location.toLowerCase().includes(q) ||
        asset.owner.toLowerCase().includes(q) ||
        asset.description.toLowerCase().includes(q) ||
        province.includes(q)
      );
    });
  }, [assets, search, provinceFilter, geo, locale]);

  const totals = useMemo(() => {
    const value = filtered.reduce((sum, a) => sum + a.purchasePrice, 0);
    const rai = filtered.reduce((sum, a) => sum + a.sizeRai + a.sizeNgan / 4, 0);
    return { value, rai };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, provinceFilter]);

  return (
    <div>
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
                {formatCompactBaht(totals.value)}
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
                {Math.round(totals.rai)} {t.common.rai}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.topNav.search}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
              />
            </div>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
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
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    —
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

        {filtered.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-[var(--card-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {formatShowingRange(
                t.land.showingRange,
                pageStart + 1,
                Math.min(pageStart + PAGE_SIZE, filtered.length),
                filtered.length
              )}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                  onClick={() => setPage(p)}
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
      </div>
    </div>
  );
}
