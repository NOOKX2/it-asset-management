import useSWR from "swr";
import { fetcher, SWR_DEFAULT_OPTIONS } from "@/lib/api/client";

type StockQuotesResponse = {
  quotes: Record<string, number>;
  source: string;
};

export function useStockQuotes(symbols: string[]) {
  const key =
    symbols.length > 0
      ? `/api/stock-quotes?symbols=${encodeURIComponent(symbols.join(","))}`
      : null;
  const { data, error, isLoading } = useSWR<StockQuotesResponse>(key, fetcher, {
    ...SWR_DEFAULT_OPTIONS,
    refreshInterval: 60_000,
  });

  return {
    quotes: data?.quotes ?? {},
    isLoading,
    error,
  };
}
