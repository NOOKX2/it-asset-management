"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCanEdit } from "@/lib/hooks/use-can-edit";
import { getLandStatusLabel, getStatusBadgeClass } from "@/lib/land-labels";
import type { LandAsset } from "@/lib/land-types";
import { CardShell, formatCompactM, SectionHeader } from "./overview-ui";

export function OverviewLandCard({ assets }: { assets: LandAsset[] }) {
  const { t } = useLocale();
  const canEdit = useCanEdit();

  return (
    <CardShell>
      <SectionHeader
        title={t.overview.landAssetsCard}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        }
        action={
          canEdit ? (
            <Link
              href="/assets/new"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              + {t.overview.addLand}
            </Link>
          ) : (
            <Link
              href="/land"
              className="text-xs font-medium text-[var(--primary-green)] hover:underline"
            >
              {t.overview.viewAll}
            </Link>
          )
        }
      />

      {assets.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">{t.land.empty}</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {assets.map((asset) => (
            <LandRow key={asset.id} asset={asset} />
          ))}
        </ul>
      )}
    </CardShell>
  );
}

function LandRow({ asset }: { asset: LandAsset }) {
  const { t } = useLocale();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(asset.imageUrl) && !imageFailed;
  const area = `${asset.sizeRai} ${t.common.rai}`;

  return (
    <li>
      <Link href="/land" className="flex items-center gap-3 py-3 first:pt-1 last:pb-0">
        <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {showImage ? (
            <Image
              src={asset.imageUrl}
              alt={asset.location}
              fill
              className="object-cover"
              sizes="64px"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{asset.location}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">{area}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusBadgeClass(asset.landStatus)}`}
            >
              {getLandStatusLabel(asset.landStatus, t.land)}
            </span>
          </div>
        </div>
        <p className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
          {formatCompactM(asset.purchasePrice)}
        </p>
      </Link>
    </li>
  );
}
