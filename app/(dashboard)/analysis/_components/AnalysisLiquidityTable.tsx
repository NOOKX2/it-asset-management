"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { formatBaht } from "@/lib/format-currency";
import type { LiquidityAsset } from "@/lib/liquidity-types";

export function AnalysisLiquidityTable({
  assets,
  className,
}: {
  assets: LiquidityAsset[];
  className: string;
}) {
  const { locale, t } = useLocale();

  return (
    <div className={className}>
      <h3 className="mb-3 shrink-0 text-sm font-semibold text-gray-900">
        {t.analysis.liquidityPerfTitle}
      </h3>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="pb-2">{t.analysis.colAsset}</th>
              <th className="pb-2">{t.analysis.colCost}</th>
              <th className="pb-2">{t.analysis.colCurrent}</th>
              <th className="pb-2">{t.analysis.colGainLoss}</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const diff = asset.currentPrice - asset.costPrice;
              const pct =
                asset.costPrice > 0 ? ((diff / asset.costPrice) * 100).toFixed(1) : "0.0";
              return (
                <tr key={asset.id} className="border-t border-gray-100">
                  <td className="max-w-[7rem] truncate py-2.5 pr-2">{asset.securityType}</td>
                  <td className="py-2.5">{formatBaht(asset.costPrice, locale)}</td>
                  <td className="py-2.5">{formatBaht(asset.currentPrice, locale)}</td>
                  <td
                    className={`py-2.5 font-medium ${diff >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {diff >= 0 ? "+" : ""}{pct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
