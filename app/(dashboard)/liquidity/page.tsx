"use client";

import { useCallback, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  MOCK_LIQUIDITY_ASSETS,
  type LiquidityAsset,
} from "@/lib/liquidity-types";

function formatBaht(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}

function gainLoss(cost: number, current: number) {
  const diff = current - cost;
  const pct = cost > 0 ? ((diff / cost) * 100).toFixed(1) : "0";
  return { pct, positive: diff >= 0 };
}

export default function LiquidityPage() {
  const { locale, t } = useLocale();
  const [assets, setAssets] = useState<LiquidityAsset[]>(MOCK_LIQUIDITY_ASSETS);
  const [editingId, setEditingId] = useState<number | null>(null);

  const totalAssets = assets.reduce((s, a) => s + a.assetsValue, 0);
  const totalCost = assets.reduce((s, a) => s + a.costPrice, 0);

  const updateCost = useCallback((id: number, costPrice: number) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          costPrice,
          assetsValue: a.currentPrice + a.debtorsValue - a.creditorsValue,
          moneyMarketValue: a.currentPrice,
        };
      })
    );
  }, []);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.liquidity.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.liquidity.subtitle}</p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-2xl border border-[var(--card-border)] bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-gray-500">{t.liquidity.totalAssetValue}</p>
            <p className="text-lg font-bold text-[var(--primary-green)]">
              {formatBaht(totalAssets, locale)}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--card-border)] bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-gray-500">{t.liquidity.totalCost}</p>
            <p className="text-lg font-bold text-gray-900">
              {formatBaht(totalCost, locale)}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
        <div className="border-b border-[var(--card-border)] bg-gray-50 px-4 py-3">
          <p className="text-sm font-semibold text-gray-700">{t.liquidity.tableTitle}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-white">
                <th className="bg-sky-300 px-3 py-2">{t.liquidity.colNo}</th>
                <th className="bg-sky-300 px-3 py-2">{t.liquidity.colHolder}</th>
                <th className="bg-sky-300 px-3 py-2">{t.liquidity.colType}</th>
                <th className="bg-sky-300 px-3 py-2">{t.liquidity.colFormat}</th>
                <th className="bg-sky-300 px-3 py-2">{t.liquidity.colInstitution}</th>
                <th className="bg-orange-300 px-3 py-2 text-gray-800">{t.liquidity.colCost}</th>
                <th className="bg-orange-200 px-3 py-2 text-gray-800">{t.liquidity.colCurrent}</th>
                <th className="bg-pink-300 px-3 py-2 text-gray-800">{t.liquidity.colDebtors}</th>
                <th className="bg-green-300 px-3 py-2 text-gray-800">{t.liquidity.colCreditors}</th>
                <th className="bg-purple-300 px-3 py-2 text-gray-800">{t.liquidity.colAssets}</th>
                <th className="bg-gray-300 px-3 py-2 text-gray-800">{t.liquidity.colRemarks}</th>
                <th className="bg-gray-200 px-3 py-2 text-gray-800">{t.common.action}</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const gl = gainLoss(asset.costPrice, asset.currentPrice);
                return (
                  <tr
                    key={asset.id}
                    className="border-t border-[var(--card-border)] hover:bg-gray-50"
                  >
                    <td className="px-3 py-3">{asset.id}</td>
                    <td className="px-3 py-3">{asset.holder}</td>
                    <td className="px-3 py-3">{asset.securityType}</td>
                    <td className="px-3 py-3">{asset.format}</td>
                    <td className="px-3 py-3">{asset.issuingInstitution}</td>
                    <td className="px-3 py-3">
                      {editingId === asset.id ? (
                        <input
                          type="number"
                          value={asset.costPrice}
                          onChange={(e) =>
                            updateCost(asset.id, Number(e.target.value))
                          }
                          className="w-28 rounded border border-gray-200 px-2 py-1 text-sm"
                        />
                      ) : (
                        formatBaht(asset.costPrice, locale)
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-medium">
                        {formatBaht(asset.currentPrice, locale)}
                      </span>
                      <span
                        className={`ml-1 text-xs ${gl.positive ? "text-green-600" : "text-red-600"}`}
                      >
                        ({gl.positive ? "+" : ""}{gl.pct}%)
                      </span>
                    </td>
                    <td className="px-3 py-3">{formatBaht(asset.debtorsValue, locale)}</td>
                    <td className="px-3 py-3">{formatBaht(asset.creditorsValue, locale)}</td>
                    <td className="px-3 py-3 font-medium text-[var(--primary-green-dark)]">
                      {formatBaht(asset.assetsValue, locale)}
                    </td>
                    <td className="px-3 py-3 text-gray-500">{asset.remarks}</td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(editingId === asset.id ? null : asset.id)
                        }
                        className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--primary-green)] hover:bg-[var(--light-green-bg)]"
                      >
                        {editingId === asset.id ? t.common.done : t.liquidity.editCost}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
