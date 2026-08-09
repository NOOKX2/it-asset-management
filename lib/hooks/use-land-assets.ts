import useSWR from "swr";
import {
  API_KEYS,
  apiPatch,
  apiPost,
  fetcher,
  SWR_DEFAULT_OPTIONS,
} from "@/lib/api/client";
import type { LandAsset } from "@/lib/land-types";

export function useLandAssets() {
  const { data, error, isLoading, mutate } = useSWR<LandAsset[]>(
    API_KEYS.landAssets,
    fetcher,
    SWR_DEFAULT_OPTIONS
  );

  const updateAsset = async (asset: LandAsset) => {
    const updated = await apiPatch<LandAsset>(
      `${API_KEYS.landAssets}/${asset.id}`,
      asset
    );
    await mutate(
      (current) =>
        current?.map((a) => (a.id === updated.id ? updated : a)) ?? [updated],
      { revalidate: false }
    );
    return updated;
  };

  const createAsset = async (asset: LandAsset) => {
    const created = await apiPost<LandAsset>(API_KEYS.landAssets, asset);
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
