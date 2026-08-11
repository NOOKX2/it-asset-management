"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { formatBaht, formatBahtCompact } from "@/lib/format-currency";
import { SummaryKpiCard, SummaryKpiGrid } from "../../_components/SummaryKpiCard";

const iconCls = "h-4 w-4 sm:h-5 sm:w-5";

export function LiquiditySummaryCards({
  totalAssets,
  totalCost,
}: {
  totalAssets: number;
  totalCost: number;
}) {
  const { locale, t } = useLocale();

  return (
    <SummaryKpiGrid columns={2}>
      <SummaryKpiCard
        label={t.liquidity.totalAssetValue}
        value={formatBahtCompact(totalAssets)}
        fullValue={formatBaht(totalAssets, locale)}
        icon={
          <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        }
      />
      <SummaryKpiCard
        label={t.liquidity.totalCost}
        value={formatBahtCompact(totalCost)}
        fullValue={formatBaht(totalCost, locale)}
        icon={
          <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />
    </SummaryKpiGrid>
  );
}
