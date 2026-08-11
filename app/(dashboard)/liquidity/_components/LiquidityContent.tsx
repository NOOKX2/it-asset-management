"use client";

import { useCallback, useState } from "react";
import { useCanEdit } from "@/lib/hooks/use-can-edit";
import { useLiquidityAssets } from "@/lib/hooks/use-liquidity-assets";
import { LiquiditySummaryCards } from "./LiquiditySummaryCards";
import { LiquidityTable } from "./LiquidityTable";

export function LiquidityContent() {
  const canEdit = useCanEdit();
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
        Loading liquidity assets…
      </div>
    );
  }

  return (
    <>
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
