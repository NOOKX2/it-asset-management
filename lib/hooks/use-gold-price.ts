import useSWR from "swr";
import { fetcher, SWR_DEFAULT_OPTIONS } from "@/lib/api/client";

export type GoldPriceQuote = {
  buyPerBaht: number;
  source: string;
  label: string;
};

export function useGoldPrice() {
  const { data, error, isLoading } = useSWR<GoldPriceQuote>(
    "/api/gold-price",
    fetcher,
    { ...SWR_DEFAULT_OPTIONS, refreshInterval: 30_000 }
  );

  return {
    buyPerBaht: data?.buyPerBaht ?? null,
    source: data?.source ?? "https://www.huasengheng.com",
    label: data?.label ?? "ฮั่วเซ่งเฮง รับซื้อ",
    isLoading,
    error,
  };
}
