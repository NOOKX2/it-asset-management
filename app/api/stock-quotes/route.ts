import { NextResponse } from "next/server";

type YahooChart = {
  chart?: {
    result?: Array<{
      meta?: { regularMarketPrice?: number };
    }>;
  };
};

async function fetchYahooPrice(symbol: string): Promise<number | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const json = (await response.json()) as YahooChart;
  const price = json.chart?.result?.[0]?.meta?.regularMarketPrice;
  return typeof price === "number" && price > 0 ? price : null;
}

async function quoteSymbol(raw: string): Promise<number | null> {
  const symbol = raw.trim().toUpperCase();
  if (!symbol) return null;
  const candidates = symbol.includes(".") ? [symbol] : [symbol, `${symbol}.BK`];
  for (const candidate of candidates) {
    const price = await fetchYahooPrice(candidate);
    if (price) return price;
  }
  return null;
}

export async function GET(request: Request) {
  const symbols = new URL(request.url).searchParams.get("symbols") ?? "";
  const list = [
    ...new Set(
      symbols
        .split(",")
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean)
    ),
  ].slice(0, 20);

  const quotes: Record<string, number> = {};
  await Promise.all(
    list.map(async (symbol) => {
      const price = await quoteSymbol(symbol);
      if (price) quotes[symbol] = price;
    })
  );

  return NextResponse.json({ quotes, source: "market" });
}
