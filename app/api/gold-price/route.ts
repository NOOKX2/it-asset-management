import { NextResponse } from "next/server";

const HSH_PRICE_URL = "https://apicheckpricev3.huasengheng.com/api/Values/GetPriceSeacon";
const SOURCE_URL = "https://www.huasengheng.com";

function parseBuyPrice(payload: string): number {
  try {
    const json: unknown = JSON.parse(payload);
    if (json && typeof json === "object" && !Array.isArray(json)) {
      const bid = Number((json as { Bid965?: unknown }).Bid965);
      if (Number.isFinite(bid) && bid > 0) return bid;
    }
  } catch {
    // Hua Seng Heng sometimes returns XML even when JSON is requested.
  }

  const xmlMatch = payload.match(/<Bid965>([\d.]+)<\/Bid965>/i);
  if (!xmlMatch) return 0;
  const bid = Number(xmlMatch[1]);
  return Number.isFinite(bid) && bid > 0 ? bid : 0;
}

export async function GET() {
  try {
    const response = await fetch(HSH_PRICE_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to load Hua Seng Heng gold price" },
        { status: 502 }
      );
    }

    const buyPerBaht = parseBuyPrice(await response.text());
    if (!buyPerBaht) {
      return NextResponse.json(
        { error: "Hua Seng Heng buy price missing" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      buyPerBaht,
      source: SOURCE_URL,
      label: "ฮั่วเซ่งเฮง รับซื้อ",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load Hua Seng Heng gold price" },
      { status: 502 }
    );
  }
}
