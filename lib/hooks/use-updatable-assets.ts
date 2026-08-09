import useSWR from "swr";
import {
  API_KEYS,
  apiPatch,
  fetcher,
  SWR_DEFAULT_OPTIONS,
} from "@/lib/api/client";
import {
  normalizeUpdatableAsset,
  type UpdatableAsset,
} from "@/lib/update-types";

export function useUpdatableAssets() {
  const { data, error, isLoading, mutate } = useSWR<UpdatableAsset[]>(
    API_KEYS.updatableAssets,
    fetcher,
    SWR_DEFAULT_OPTIONS
  );

  const assets = (data ?? []).map((asset) => normalizeUpdatableAsset(asset));

  const updateAsset = async (asset: UpdatableAsset) => {
    const updated = normalizeUpdatableAsset(
      await apiPatch<UpdatableAsset>(
        `${API_KEYS.updatableAssets}/${asset.id}`,
        asset
      )
    );
    await mutate(
      (current) =>
        current?.map((a) => (a.id === updated.id ? updated : a)) ?? [updated],
      { revalidate: false }
    );
    return updated;
  };

  return {
    assets,
    isLoading,
    error,
    mutate,
    updateAsset,
  };
}
