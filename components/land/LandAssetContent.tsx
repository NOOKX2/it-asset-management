"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AssetDetailsForm } from "@/components/land/AssetDetailsForm";
import { LandTableView } from "@/components/land/LandTableView";
import { MapPanel } from "@/components/land/MapPanel";
import { useLandAssets } from "@/lib/hooks/use-land-assets";
import type { LandAsset } from "@/lib/land-types";
import { parseLandViewMode } from "@/lib/land-view";
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
  const searchParams = useSearchParams();
  const viewMode = parseLandViewMode(searchParams.get("view"));
  const { assets: rawAssets, isLoading, updateAsset } = useLandAssets();
  const assets = useMemo(() => rawAssets.map(normalizeAsset), [rawAssets]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedProvince, setFocusedProvince] = useState<FocusedProvince | null>(
    null
  );

  const selectedAsset = selectedId
    ? assets.find((a) => a.id === selectedId)
    : undefined;

  const handleSave = useCallback(
    async (updated: LandAsset) => {
      await updateAsset(updated);
    },
    [updateAsset]
  );

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
      if (viewMode === "map" && !focusedProvince) return;
      setSelectedId(id);
    },
    [focusedProvince, viewMode]
  );

  const handleEditFromTable = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const panelOpen = Boolean(selectedAsset);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-sm text-gray-500">
        Loading map data…
      </div>
    );
  }

  if (viewMode === "table") {
    return (
      <>
        <LandTableView assets={assets} onEdit={handleEditFromTable} />

        {panelOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSelectedId(null)}
            aria-label="Close panel"
          />
        )}

        <div
          className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-full max-w-[420px] border-l border-[var(--card-border)] bg-white shadow-2xl transition-transform duration-300 ease-out ${
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
      </>
    );
  }

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
