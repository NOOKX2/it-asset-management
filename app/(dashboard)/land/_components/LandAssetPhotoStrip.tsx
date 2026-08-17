"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatBahtCompact } from "@/lib/format-currency";
import { getLandStatusLabel } from "@/lib/land-labels";
import type { LandAsset } from "@/lib/land-types";
import { getStatusBadgeClass } from "./land-table-utils";

export function LandAssetPhotoStrip({
  assets,
  selectedId,
  onSelect,
}: {
  assets: LandAsset[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useLocale();

  return (
    <aside className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--card-border)] px-3 py-2">
        <p className="truncate text-sm font-semibold text-gray-900">
          {t.land.photoGallery}
        </p>
        <span className="shrink-0 text-xs text-gray-500">{assets.length}</span>
      </div>

      {assets.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500">{t.land.empty}</p>
      ) : (
        <div className="flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden p-3 lg:flex-col lg:snap-none lg:overflow-x-hidden lg:overflow-y-auto">
          {assets.map((asset) => (
            <AssetPhotoCard
              key={asset.id}
              asset={asset}
              selected={selectedId === asset.id}
              onSelect={() => onSelect(asset.id)}
            />
          ))}
        </div>
      )}
    </aside>
  );
}

function AssetPhotoCard({
  asset,
  selected,
  onSelect,
}: {
  asset: LandAsset;
  selected: boolean;
  onSelect: () => void;
}) {
  const { t } = useLocale();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(asset.imageUrl) && !imageFailed;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative h-full min-h-0 w-[82%] shrink-0 snap-center overflow-hidden rounded-xl border text-left shadow-sm transition lg:h-48 lg:w-full ${
        selected
          ? "border-[var(--primary-green)] ring-2 ring-[var(--primary-green)]/30"
          : "border-[var(--card-border)] hover:border-gray-300"
      }`}
    >
      {showImage ? (
        <Image
          src={asset.imageUrl}
          alt={asset.location}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, 82vw"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
        <p className="truncate text-sm font-semibold text-white">{asset.location}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-white/90">
            {formatBahtCompact(asset.purchasePrice)}
          </p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusBadgeClass(asset.landStatus)}`}
          >
            {getLandStatusLabel(asset.landStatus, t.land)}
          </span>
        </div>
      </div>
    </button>
  );
}
