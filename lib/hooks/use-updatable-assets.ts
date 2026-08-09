import useSWR from "swr";
import {
  API_KEYS,
  apiPatch,
  fetcher,
  SWR_DEFAULT_OPTIONS,
} from "@/lib/api/client";
import type { UpdatableAsset } from "@/lib/update-types";

export function useUpdatableAssets() {
  const { data, error, isLoading, mutate } = useSWR<UpdatableAsset[]>(
    API_KEYS.updatableAssets,
    fetcher,
    SWR_DEFAULT_OPTIONS
  );

  const updateAsset = async (asset: UpdatableAsset) => {
    const updated = await apiPatch<UpdatableAsset>(
      `${API_KEYS.updatableAssets}/${asset.id}`,
      asset
    );
    await mutate(
      (current) =>
        current?.map((a) => (a.id === updated.id ? updated : a)) ?? [updated],
      { revalidate: false }
    );
    return updated;
  };

  return {
    assets: data ?? [],
    isLoading,
    error,
    mutate,
    updateAsset,
  };
}
