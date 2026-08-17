"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { ThailandHeatmapHandle } from "./ThailandHeatmap";
import type { LandAsset } from "@/lib/land-types";
import { type AssetTypeFilter, filterAssetsByType } from "@/lib/thailand-provinces";
import {
  AssetTypeFilterControl,
  HeatmapLegend,
  MapTotalsCards,
  MapZoomControls,
} from "./MapOverlayControls";

const ThailandHeatmap = dynamic(
  () => import("./ThailandHeatmap").then((m) => m.ThailandHeatmap),
  { ssr: false }
);

type FocusedProvince = {
  code: string;
  nameTh: string;
  nameEn: string;
};

interface MapPanelProps {
  assets: LandAsset[];
  selectedId: string | null;
  onSelectAsset: (id: string) => void;
  panelOpen: boolean;
  focusedProvince: FocusedProvince | null;
  onProvinceFocus: (code: string, nameTh: string, nameEn: string) => void;
  onBackToCountry: () => void;
}

export function MapPanel({
  assets,
  selectedId,
  onSelectAsset,
  panelOpen,
  focusedProvince,
  onProvinceFocus,
  onBackToCountry,
}: MapPanelProps) {
  const { locale, t } = useLocale();
  const mapRef = useRef<ThailandHeatmapHandle>(null);
  const [assetFilter, setAssetFilter] = useState<AssetTypeFilter>("all");

  const filteredAssets = useMemo(
    () => filterAssetsByType(assets, assetFilter),
    [assets, assetFilter]
  );

  const filteredTotals = useMemo(() => {
    const value = filteredAssets.reduce((sum, a) => sum + a.purchasePrice, 0);
    const rai = filteredAssets.reduce(
      (sum, a) => sum + a.sizeRai + a.sizeNgan / 4,
      0
    );
    return { value, rai };
  }, [filteredAssets]);

  const recenter = () => {
    onBackToCountry();
    mapRef.current?.recenter();
  };

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#f9f5f2]">
      <div className="absolute inset-0 z-0">
        <ThailandHeatmap
          ref={mapRef}
          assets={filteredAssets}
          selectedId={selectedId}
          focusedProvinceCode={focusedProvince?.code ?? null}
          onProvinceFocus={onProvinceFocus}
          onSelectAsset={onSelectAsset}
        />
      </div>

      {focusedProvince && (
        <div className="absolute left-5 top-5 z-20 flex items-center gap-3">
          <button
            type="button"
            onClick={recenter}
            className="flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.land.backToThailandMap}
          </button>
          <span className="rounded-xl border border-[var(--light-green)] bg-[var(--light-green-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-green-dark)] shadow-sm">
            {locale === "th" ? focusedProvince.nameTh : focusedProvince.nameEn}
          </span>
        </div>
      )}

      <AssetTypeFilterControl
        value={assetFilter}
        onChange={setAssetFilter}
        offsetTop={Boolean(focusedProvince)}
        t={t.land}
      />

      <MapTotalsCards
        totalValue={filteredTotals.value}
        totalRai={filteredTotals.rai}
        offsetTop={Boolean(focusedProvince)}
        t={t.land}
        raiLabel={t.common.rai}
      />

      <HeatmapLegend t={t.land} />

      <MapZoomControls
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onRecenter={recenter}
        t={t.land}
      />

      {!panelOpen && (
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border border-gray-200/80 bg-white/95 px-4 py-2 text-xs text-gray-600 shadow-md backdrop-blur-sm">
          {focusedProvince ? t.land.provinceViewHint : t.land.countryViewHint}
        </div>
      )}
    </div>
  );
}
