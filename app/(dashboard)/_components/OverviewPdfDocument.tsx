import type { CSSProperties } from "react";
import { formatBaht } from "@/lib/format-currency";
import type { Messages } from "@/lib/i18n/types";
import { getLandStatusLabel } from "@/lib/land-labels";
import type { LandAsset } from "@/lib/land-types";
import { getLiquidityKind } from "@/lib/liquidity-kind";
import type { LiquidityAsset } from "@/lib/liquidity-types";
import {
  daysOutstanding,
  formatDaysOutstanding,
  formatIsoDate,
} from "@/lib/loan-tenure";
import type { OverviewMetrics } from "./use-overview-metrics";

const FONT =
  'Thonburi, "Noto Sans Thai", Tahoma, "Segoe UI", sans-serif';

type OverviewPdfDocumentProps = {
  locale: "th" | "en";
  t: Messages;
  generatedAt: string;
  metrics: OverviewMetrics;
  landAssets: LandAsset[];
  liquidityAssets: LiquidityAsset[];
};

function kindLabel(kind: string, o: Messages["overview"]) {
  if (kind === "bonds") return o.bonds;
  if (kind === "gold") return o.gold;
  if (kind === "cash") return o.cash;
  if (kind === "loans") return o.loans;
  return o.stocks;
}

function liquidityDetail(asset: LiquidityAsset, locale: "th" | "en") {
  const kind = getLiquidityKind(asset.securityType);
  if (kind === "loan") {
    const days = daysOutstanding(asset.borrowedOn);
    const date = asset.borrowedOn ? formatIsoDate(asset.borrowedOn, locale) : "—";
    const tenure = days == null ? "" : ` · ${formatDaysOutstanding(days, locale)}`;
    return `${asset.borrowerName || asset.issuingInstitution} · ${date}${tenure}`;
  }
  if (kind === "gold" && asset.goldWeightBaht > 0) {
    return `${asset.goldWeightBaht} ${locale === "th" ? "บาททอง" : "baht gold"}`;
  }
  return [asset.symbol, asset.format, asset.issuingInstitution].filter(Boolean).join(" · ") || "—";
}

export function OverviewPdfDocument({
  locale,
  t,
  generatedAt,
  metrics,
  landAssets,
  liquidityAssets,
}: OverviewPdfDocumentProps) {
  const o = t.overview;
  const summaries = [
    { label: o.kpiTotalAssets, value: formatBaht(metrics.netBookValue, locale) },
    { label: o.kpiLandAssets, value: formatBaht(metrics.landValue, locale) },
    { label: o.kpiLiquidAssets, value: formatBaht(metrics.liquidityTotal, locale) },
  ];

  return (
    <div
      style={{
        width: 794,
        padding: 40,
        background: "#ffffff",
        color: "#111827",
        fontFamily: FONT,
      }}
    >
      <p style={{ margin: 0, fontSize: 11, letterSpacing: 1.2, color: "#6b7280" }}>
        {t.sidebar.brand.toUpperCase()}
      </p>
      <h1 style={{ margin: "6px 0 4px", fontSize: 22 }}>{o.pdfReportTitle}</h1>
      <p style={{ margin: "0 0 20px", fontSize: 12, color: "#6b7280" }}>
        {o.pdfGeneratedOn}: {generatedAt} · {o.exportPdfHint}
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        {summaries.map((item) => (
          <div
            key={item.label}
            style={{
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "12px 14px",
              background: item.label === o.kpiTotalAssets ? "#fff1e8" : "#f9fafb",
            }}
          >
            <p style={{ margin: 0, fontSize: 10, color: "#6b7280" }}>{item.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 16, fontWeight: 700 }}>{item.value}</p>
          </div>
        ))}
      </div>

      <h2 style={{ margin: "0 0 8px", fontSize: 13 }}>{o.assetAllocation}</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 22 }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={thStyle}>{o.pdfCategory}</th>
            <th style={{ ...thStyle, textAlign: "right" }}>{o.pdfValue}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>{o.kpiLandAssets}</td>
            <td style={{ ...tdStyle, textAlign: "right" }}>{formatBaht(metrics.landValue, locale)}</td>
          </tr>
          {metrics.liquiditySegments
            .filter((seg) => seg.value > 0)
            .map((seg) => (
              <tr key={seg.key}>
                <td style={tdStyle}>{kindLabel(seg.key, o)}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{formatBaht(seg.value, locale)}</td>
              </tr>
            ))}
          <tr>
            <td style={{ ...tdStyle, fontWeight: 700 }}>{o.kpiTotalAssets}</td>
            <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>
              {formatBaht(metrics.netBookValue, locale)}
            </td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ margin: "0 0 8px", fontSize: 13 }}>{o.landAssetsCard}</h2>
      {landAssets.length === 0 ? (
        <p style={{ fontSize: 11, color: "#6b7280" }}>{o.pdfEmpty}</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, marginBottom: 22 }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={thStyle}>{t.land.location.split(" (")[0]}</th>
              <th style={thStyle}>{t.land.owner}</th>
              <th style={thStyle}>{t.land.landStatus}</th>
              <th style={thStyle}>{t.land.size}</th>
              <th style={{ ...thStyle, textAlign: "right" }}>{t.land.purchasePrice}</th>
            </tr>
          </thead>
          <tbody>
            {landAssets.map((asset) => (
              <tr key={asset.id}>
                <td style={tdStyle}>{asset.location}</td>
                <td style={tdStyle}>{asset.owner || "—"}</td>
                <td style={tdStyle}>{getLandStatusLabel(asset.landStatus, t.land)}</td>
                <td style={tdStyle}>
                  {asset.sizeRai}-{asset.sizeNgan}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {formatBaht(asset.purchasePrice, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ margin: "0 0 8px", fontSize: 13 }}>{t.nav.liquidity}</h2>
      {liquidityAssets.length === 0 ? (
        <p style={{ fontSize: 11, color: "#6b7280" }}>{o.pdfEmpty}</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={thStyle}>{t.liquidity.colType}</th>
              <th style={thStyle}>{t.liquidity.colHolder}</th>
              <th style={thStyle}>{o.pdfDetail}</th>
              <th style={{ ...thStyle, textAlign: "right" }}>{t.liquidity.colCost}</th>
              <th style={{ ...thStyle, textAlign: "right" }}>{t.liquidity.colAssets}</th>
            </tr>
          </thead>
          <tbody>
            {liquidityAssets.map((asset) => (
              <tr key={asset.id}>
                <td style={tdStyle}>{asset.securityType}</td>
                <td style={tdStyle}>{asset.holder}</td>
                <td style={tdStyle}>{liquidityDetail(asset, locale)}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {formatBaht(asset.costPrice, locale)}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {formatBaht(asset.assetsValue, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "6px 8px",
  border: "1px solid #e5e7eb",
  fontWeight: 600,
};

const tdStyle: CSSProperties = {
  padding: "6px 8px",
  border: "1px solid #e5e7eb",
  verticalAlign: "top",
};
