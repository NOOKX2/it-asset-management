import useSWR from "swr";
import {
  API_KEYS,
  apiPost,
  fetcher,
  SWR_DEFAULT_OPTIONS,
} from "@/lib/api/client";
import type { Vendor } from "@/lib/vendor-types";

export function useVendors() {
  const { data, error, isLoading, mutate } = useSWR<Vendor[]>(
    API_KEYS.vendors,
    fetcher,
    SWR_DEFAULT_OPTIONS
  );

  const createVendor = async (vendor: Vendor) => {
    const created = await apiPost<Vendor>(API_KEYS.vendors, vendor);
    await mutate((current) => [...(current ?? []), created], {
      revalidate: false,
    });
    return created;
  };

  return {
    vendors: data ?? [],
    isLoading,
    error,
    mutate,
    createVendor,
  };
}
