"use client";

import { useCallback, useMemo, useState } from "react";
import { AssetDetailsForm } from "@/components/land/AssetDetailsForm";
import { MapPanel } from "@/components/land/MapPanel";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MOCK_LAND_ASSETS, type LandAsset } from "@/lib/land-types";

export function LandAssetContent() {
  const [assets, setAssets] = useState<LandAsset[]>(MOCK_LAND_ASSETS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedAsset = selectedId
    ? assets.find((a) => a.id === selectedId)
    : undefined;

  const totals = useMemo(() => {
    const totalValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
    const totalRai = assets.reduce(
      (sum, a) => sum + a.sizeRai + a.sizeNgan / 4,
      0
    );
    return { totalValue, totalRai };
  }, [assets]);

  const handleSave = useCallback((updated: LandAsset) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  }, []);

  const panelOpen = Boolean(selectedAsset);

  return (
    <div className="relative -m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <MapPanel
        assets={assets}
        selectedId={selectedId}
        onSelectAsset={setSelectedId}
        totalValue={totals.totalValue}
        totalRai={totals.totalRai}
        panelOpen={panelOpen}
      />

      {/* Backdrop on mobile */}
      {panelOpen && (
        <button
          type="button"
          className="absolute inset-0 z-30 bg-black/30 lg:bg-transparent"
          onClick={() => setSelectedId(null)}
          aria-label="Close panel"
        />
      )}

      {/* Slide-out details panel */}
      <div
        className={`absolute inset-y-0 right-0 z-40 w-full max-w-[420px] border-l border-[var(--card-border)] bg-white shadow-2xl transition-transform duration-300 ease-out ${
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
