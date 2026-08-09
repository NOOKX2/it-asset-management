import useSWR from "swr";
import {
  API_KEYS,
  apiPatch,
  apiPost,
  fetcher,
  SWR_DEFAULT_OPTIONS,
} from "@/lib/api/client";
import type { LiquidityAsset } from "@/lib/liquidity-types";

export function useLiquidityAssets() {
  const { data, error, isLoading, mutate } = useSWR<LiquidityAsset[]>(
    API_KEYS.liquidityAssets,
    fetcher,
    SWR_DEFAULT_OPTIONS
  );

  const updateAsset = async (asset: LiquidityAsset) => {
    const updated = await apiPatch<LiquidityAsset>(
      `${API_KEYS.liquidityAssets}/${asset.id}`,
      asset
    );
    await mutate(
      (current) =>
        current?.map((a) => (a.id === updated.id ? updated : a)) ?? [updated],
      { revalidate: false }
    );
    return updated;
  };

  const createAsset = async (
    asset: Omit<LiquidityAsset, "id">
  ) => {
    const created = await apiPost<LiquidityAsset>(
      API_KEYS.liquidityAssets,
      asset
    );
    await mutate((current) => [...(current ?? []), created], {
      revalidate: false,
    });
    return created;
  };

  return {
    assets: data ?? [],
    isLoading,
    error,
    mutate,
    updateAsset,
    createAsset,
  };
}
