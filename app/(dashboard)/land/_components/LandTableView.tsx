"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { LandAsset } from "@/lib/land-types";
import type { ProvinceFeatureCollection } from "@/lib/thailand-provinces";
import {
  findProvinceCode,
  getProvinceName,
} from "@/lib/thailand-provinces";
import { LandTableBody } from "./LandTableBody";
import { LandTableSummary, LandTableToolbar } from "./LandTableHeader";
import { LAND_TABLE_PAGE_SIZE } from "./land-table-utils";

interface LandTableViewProps {
  assets: LandAsset[];
  onEdit: (id: string) => void;
  canEdit?: boolean;
}

export function LandTableView({ assets, onEdit, canEdit = true }: LandTableViewProps) {
  const { locale } = useLocale();
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

  const getAssetProvinceCode = (asset: LandAsset): string | null => {
    if (!geo) return null;
    return findProvinceCode(geo, asset.latitude, asset.longitude);
  };

  const getAssetProvince = (asset: LandAsset): string => {
    if (!geo) return asset.location;
    const code = findProvinceCode(geo, asset.latitude, asset.longitude);
    if (!code) return asset.location;
    return getProvinceName(geo, code, locale);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / LAND_TABLE_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * LAND_TABLE_PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + LAND_TABLE_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, provinceFilter]);

  return (
    <div>
      <LandTableSummary totalValue={totals.value} totalRai={totals.rai} />

      <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
        <LandTableToolbar
          search={search}
          onSearchChange={setSearch}
          provinceFilter={provinceFilter}
          onProvinceFilterChange={setProvinceFilter}
          provinceOptions={provinceOptions}
          canEdit={canEdit}
        />

        <LandTableBody
          assets={assets}
          pageRows={pageRows}
          pageStart={pageStart}
          totalAssets={assets.length}
          filteredCount={filtered.length}
          currentPage={currentPage}
          totalPages={totalPages}
          canEdit={canEdit}
          getAssetProvince={getAssetProvince}
          onEdit={onEdit}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
