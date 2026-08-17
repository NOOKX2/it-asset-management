import useSWR from "swr";
import {
  API_KEYS,
  apiPatch,
  apiPost,
  fetcher,
  SWR_DEFAULT_OPTIONS,
} from "@/lib/api/client";
import { uniqueStockSymbols, applyLiveAssetPrices } from "@/lib/liquidity-live-prices";
import type { LiquidityAsset } from "@/lib/liquidity-types";
import { useGoldPrice } from "./use-gold-price";
import { useStockQuotes } from "./use-stock-quotes";

export function useLiquidityAssets() {
  const { data, error, isLoading, mutate } = useSWR<LiquidityAsset[]>(
    API_KEYS.liquidityAssets,
    fetcher,
    SWR_DEFAULT_OPTIONS
  );
  const stored = data ?? [];
  const { buyPerBaht } = useGoldPrice();
  const { quotes } = useStockQuotes(uniqueStockSymbols(stored));
  const assets = applyLiveAssetPrices(stored, buyPerBaht, quotes);

  const updateAsset = async (asset: LiquidityAsset) => {
    const updated = await apiPatch<LiquidityAsset>(
      `${API_KEYS.liquidityAssets}/${asset.id}`,
      asset
    );
    await mutate(
      (current) =>
        current?.map((row) => (row.id === updated.id ? updated : row)) ?? [updated],
      { revalidate: false }
    );
    return updated;
  };

  const createAsset = async (asset: Omit<LiquidityAsset, "id">) => {
    const created = await apiPost<LiquidityAsset>(API_KEYS.liquidityAssets, asset);
    await mutate((current) => [...(current ?? []), created], { revalidate: false });
    return created;
  };

  return {
    assets,
    isLoading,
    error,
    mutate,
    updateAsset,
    createAsset,
  };
}
