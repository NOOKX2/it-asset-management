"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AssetDetailsForm } from "./AssetDetailsForm";
import { LandAssetPhotoStrip } from "./LandAssetPhotoStrip";
import { LandTableView } from "./LandTableView";
import { MapPanel } from "./MapPanel";
import { useLandAssets } from "@/lib/hooks/use-land-assets";
import { useCanEdit } from "@/lib/hooks/use-can-edit";
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
  const canEdit = useCanEdit();
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
        <LandTableView assets={assets} onEdit={handleEditFromTable} canEdit={canEdit} />

        {panelOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSelectedId(null)}
            aria-label="Close panel"
          />
        )}

        <div
          className={`fixed top-14 right-0 z-50 h-[calc(100vh-3.5rem)] w-full max-w-[420px] border-l border-[var(--card-border)] bg-white shadow-2xl transition-transform duration-300 ease-out sm:top-16 sm:h-[calc(100vh-4rem)] ${
            panelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {selectedAsset && (
            <AssetDetailsForm
              asset={selectedAsset}
              onSave={handleSave}
              onClose={() => setSelectedId(null)}
              variant="panel"
              readOnly={!canEdit}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <div className="relative -m-4 -mb-16 flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden sm:-m-6 sm:-mb-8 sm:h-[calc(100vh-4rem)] lg:flex-row">
      <div className="relative min-h-0 min-w-0 flex-[2]">
        <MapPanel
          assets={assets}
          selectedId={selectedId}
          onSelectAsset={handleSelectAsset}
          panelOpen={panelOpen}
          focusedProvince={focusedProvince}
          onProvinceFocus={handleProvinceFocus}
          onBackToCountry={handleBackToCountry}
        />
      </div>

      <div className="relative z-20 min-h-0 min-w-0 flex-[1] border-t border-[var(--card-border)] bg-white lg:border-t-0 lg:border-l">
        {selectedAsset ? (
          <>
            <div className="hidden h-full lg:block">
              <AssetDetailsForm
                asset={selectedAsset}
                onSave={handleSave}
                onClose={() => setSelectedId(null)}
                variant="panel"
                readOnly={!canEdit}
              />
            </div>
            <div className="h-full lg:hidden">
              <LandAssetPhotoStrip
                assets={assets}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </>
        ) : (
          <LandAssetPhotoStrip
            assets={assets}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </div>

      {panelOpen && (
        <button
          type="button"
          className="absolute inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSelectedId(null)}
          aria-label="Close panel"
        />
      )}

      <div
        className={`fixed top-14 right-0 z-40 h-[calc(100vh-3.5rem)] w-full max-w-[420px] border-l border-[var(--card-border)] bg-white shadow-2xl transition-transform duration-300 ease-out sm:top-16 sm:h-[calc(100vh-4rem)] lg:hidden ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedAsset && (
          <AssetDetailsForm
            asset={selectedAsset}
            onSave={handleSave}
            onClose={() => setSelectedId(null)}
            variant="panel"
            readOnly={!canEdit}
          />
        )}
      </div>
    </div>
  );
}
