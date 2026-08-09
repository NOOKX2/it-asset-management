"use client";

import { useCallback, useState } from "react";
import { AssetDetailsForm } from "@/components/land/AssetDetailsForm";
import { MapPanel } from "@/components/land/MapPanel";
import { getAddedLandAssets } from "@/lib/asset-storage";
import { MOCK_LAND_ASSETS, type LandAsset } from "@/lib/land-types";
import { normalizeLandAssetCoords } from "@/lib/thailand-map";

function normalizeAsset(raw: LandAsset & { mapX?: number; mapY?: number }): LandAsset {
  const coords = normalizeLandAssetCoords(raw);
  return { ...raw, ...coords };
}

type FocusedProvince = {
  code: string;
  nameTh: string;
  nameEn: string;
};

export function LandAssetContent() {
  const [assets, setAssets] = useState<LandAsset[]>(() =>
    [...MOCK_LAND_ASSETS, ...getAddedLandAssets()].map(normalizeAsset)
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedProvince, setFocusedProvince] = useState<FocusedProvince | null>(
    null
  );

  const selectedAsset = selectedId
    ? assets.find((a) => a.id === selectedId)
    : undefined;

  const handleSave = useCallback((updated: LandAsset) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  }, []);

  const handleProvinceFocus = useCallback(
    (code: string, nameTh: string, nameEn: string) => {
      setFocusedProvince({ code, nameTh, nameEn });
      setSelectedId(null);
    },
    []
  );

  const handleBackToCountry = useCallback(() => {
    setFocusedProvince(null);
    setSelectedId(null);
  }, []);

  const handleSelectAsset = useCallback(
    (id: string) => {
      if (!focusedProvince) return;
      setSelectedId(id);
    },
    [focusedProvince]
  );

  const panelOpen = Boolean(selectedAsset);

  return (
    <div className="relative -m-6 min-h-[calc(100vh-4rem)]">
      <MapPanel
        assets={assets}
        selectedId={selectedId}
        onSelectAsset={handleSelectAsset}
        panelOpen={panelOpen}
        focusedProvince={focusedProvince}
        onProvinceFocus={handleProvinceFocus}
        onBackToCountry={handleBackToCountry}
      />

      {panelOpen && (
        <button
          type="button"
          className="absolute inset-0 z-30 bg-black/30 lg:bg-transparent"
          onClick={() => setSelectedId(null)}
          aria-label="Close panel"
        />
      )}

      <div
        className={`fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-full max-w-[420px] border-l border-[var(--card-border)] bg-white shadow-2xl transition-transform duration-300 ease-out ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedAsset && (
          <AssetDetailsForm
            asset={selectedAsset}
            onSave={handleSave}
            onClose={() => setSelectedId(null)}
            variant="panel"
          />
        )}
      </div>
    </div>
  );
}
