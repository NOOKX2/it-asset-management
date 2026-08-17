"use client";

import { useCallback, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCanEdit } from "@/lib/hooks/use-can-edit";
import { useGoldPrice } from "@/lib/hooks/use-gold-price";
import { useLiquidityAssets } from "@/lib/hooks/use-liquidity-assets";
import { formatBaht } from "@/lib/format-currency";
import { LiquiditySummaryCards } from "./LiquiditySummaryCards";
import { LiquidityTable } from "./LiquidityTable";

export function LiquidityContent() {
  const { locale, t } = useLocale();
  const canEdit = useCanEdit();
  const { buyPerBaht, source } = useGoldPrice();
  const { assets, isLoading, updateAsset } = useLiquidityAssets();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCost, setEditCost] = useState(0);

  const totalAssets = assets.reduce((s, a) => s + a.assetsValue, 0);
  const totalCost = assets.reduce((s, a) => s + a.costPrice, 0);

  const startEdit = useCallback((id: number, costPrice: number) => {
    setEditingId(id);
    setEditCost(costPrice);
  }, []);

  const finishEdit = useCallback(async () => {
    if (editingId === null) return;
    const asset = assets.find((a) => a.id === editingId);
    if (!asset) return;
    await updateAsset({
      ...asset,
      costPrice: editCost,
      assetsValue: asset.currentPrice + asset.debtorsValue - asset.creditorsValue,
      moneyMarketValue: asset.currentPrice,
    });
    setEditingId(null);
  }, [assets, editingId, editCost, updateAsset]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Loading assets…
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{t.liquidity.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.liquidity.subtitle}</p>
        </div>
        {buyPerBaht ? (
          <a
            href={source}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-right"
          >
            <p className="text-[11px] font-medium text-amber-800">{t.liquidity.goldBuyQuote}</p>
            <p className="text-sm font-bold tabular-nums text-amber-950">
              {formatBaht(buyPerBaht, locale)}
            </p>
            <p className="text-[10px] text-amber-700">{t.liquidity.goldBuySource}</p>
          </a>
        ) : null}
      </div>
      <LiquiditySummaryCards totalAssets={totalAssets} totalCost={totalCost} />
      <LiquidityTable
        assets={assets}
        canEdit={canEdit}
        editingId={editingId}
        editCost={editCost}
        onStartEdit={startEdit}
        onFinishEdit={finishEdit}
        onEditCostChange={setEditCost}
      />
    </>
  );
}
