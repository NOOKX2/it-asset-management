"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { formatBaht } from "@/lib/format-currency";
import { getLiquidityKind } from "@/lib/liquidity-kind";
import type { LiquidityAsset } from "@/lib/liquidity-types";
import {
  daysOutstanding,
  formatDaysOutstanding,
  formatIsoDate,
} from "@/lib/loan-tenure";
import { AssetTypeBadge, ThCell, gainLoss } from "./liquidity-ui";

const iconCls = "h-4 w-4";

type LiquidityTableProps = {
  assets: LiquidityAsset[];
  canEdit: boolean;
  editingId: number | null;
  editCost: number;
  onStartEdit: (id: number, costPrice: number) => void;
  onFinishEdit: () => void;
  onEditCostChange: (cost: number) => void;
};

export function LiquidityTable({
  assets,
  canEdit,
  editingId,
  editCost,
  onStartEdit,
  onFinishEdit,
  onEditCostChange,
}: LiquidityTableProps) {
  const { locale, t } = useLocale();

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1500px] text-sm">
          <thead className="bg-gray-100">
            <tr className="border-b border-[var(--card-border)]">
              <ThCell
                label={t.liquidity.colNo}
                icon={
                  <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                }
              />
              <ThCell
                label={t.liquidity.colHolder}
                icon={
                  <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />
              <ThCell
                label={t.liquidity.colType}
                icon={
                  <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
              <ThCell
                label={t.liquidity.colBorrower}
                icon={
                  <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              <ThCell
                label={t.liquidity.colBorrowedOn}
                icon={
                  <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <ThCell
                label={t.liquidity.colDays}
                icon={
                  <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <ThCell label={t.liquidity.colFormat} icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
              <ThCell label={t.liquidity.colInstitution} icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>} />
              <ThCell label={t.liquidity.colCost} icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
              <ThCell label={t.liquidity.colCurrent} icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
              <ThCell label={t.liquidity.colDebtors} icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>} />
              <ThCell label={t.liquidity.colCreditors} icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>} />
              <ThCell label={t.liquidity.colAssets} icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
              <ThCell label={t.liquidity.colRemarks} icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>} />
              {canEdit && (
                <ThCell label={t.common.action} icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
              )}
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td
                  colSpan={canEdit ? 15 : 14}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  {t.liquidity.empty}
                </td>
              </tr>
            ) : (
              assets.map((asset) => {
                const gl = gainLoss(asset.costPrice, asset.currentPrice);
                const isLoan = getLiquidityKind(asset.securityType) === "loan";
                const days = isLoan ? daysOutstanding(asset.borrowedOn) : null;
                return (
                  <tr
                    key={asset.id}
                    className="border-t border-[var(--card-border)] transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-4 text-center text-gray-500">{asset.id}</td>
                    <td className="px-4 py-4 font-medium text-gray-900">{asset.holder}</td>
                    <td className="px-4 py-4">
                      <AssetTypeBadge securityType={asset.securityType} />
                    </td>
                    <td className="px-4 py-4 text-gray-800">
                      {isLoan ? asset.borrowerName || asset.issuingInstitution || "—" : "—"}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {isLoan && asset.borrowedOn
                        ? formatIsoDate(asset.borrowedOn, locale)
                        : "—"}
                    </td>
                    <td className="px-4 py-4 font-medium tabular-nums text-gray-900">
                      {days == null ? "—" : formatDaysOutstanding(days, locale)}
                    </td>
                    <td className="px-4 py-4 text-gray-700">{asset.format}</td>
                    <td className="px-4 py-4 text-gray-700">{asset.issuingInstitution}</td>
                    <td className="px-4 py-4 text-gray-900">
                      {editingId === asset.id ? (
                        <input
                          type="number"
                          value={editCost}
                          onChange={(e) => onEditCostChange(Number(e.target.value))}
                          className="no-spin w-32 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
                        />
                      ) : (
                        formatBaht(asset.costPrice, locale)
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">
                        {formatBaht(asset.currentPrice, locale)}
                      </div>
                      <div
                        className={`text-xs font-medium ${gl.positive ? "text-green-600" : "text-red-500"}`}
                      >
                        ({gl.positive ? "+" : ""}{gl.pct}%)
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {formatBaht(asset.debtorsValue, locale)}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {formatBaht(asset.creditorsValue, locale)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[var(--primary-green-dark)]">
                      {formatBaht(asset.assetsValue, locale)}
                    </td>
                    <td className="px-4 py-4 text-gray-500">{asset.remarks}</td>
                    {canEdit && (
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (editingId === asset.id) {
                              onFinishEdit();
                            } else {
                              onStartEdit(asset.id, asset.costPrice);
                            }
                          }}
                          className="rounded-lg bg-[var(--primary-green)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--primary-green-dark)]"
                        >
                          {editingId === asset.id ? t.common.done : t.liquidity.editCost}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
