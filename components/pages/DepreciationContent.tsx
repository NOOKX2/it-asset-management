"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { MOCK_LAND_ASSETS } from "@/lib/land-types";

function formatBaht(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}

const IT_DEPRECIATION = [
  { id: "LT-2023-041", name: "Dell Laptop XPS", purchase: 45000, annual: 9000, accumulated: 18000, book: 27000, rate: "20%" },
  { id: "SRV-NY-012", name: "Dell PowerEdge Server", purchase: 280000, annual: 56000, accumulated: 112000, book: 168000, rate: "20%" },
  { id: "MON-045", name: "LG 27\" Monitor", purchase: 8500, annual: 1700, accumulated: 5100, book: 3400, rate: "20%" },
  { id: "NET-SW-008", name: "Cisco Switch 48-port", purchase: 125000, annual: 25000, accumulated: 50000, book: 75000, rate: "20%" },
];

export function DepreciationContent() {
  const { locale, t } = useLocale();

  const landRows = MOCK_LAND_ASSETS.map((a) => ({
    id: a.id,
    name: a.location,
    purchase: a.purchasePrice,
    annual: 0,
    accumulated: 0,
    book: a.purchasePrice,
    rate: "N/A",
  }));

  const allRows = [...landRows, ...IT_DEPRECIATION];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.depreciation.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.depreciation.subtitle}</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">{t.depreciation.totalPurchase}</p>
          <p className="text-xl font-bold text-gray-900">
            {formatBaht(allRows.reduce((s, r) => s + r.purchase, 0), locale)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">{t.depreciation.accumulated}</p>
          <p className="text-xl font-bold text-red-600">
            {formatBaht(allRows.reduce((s, r) => s + r.accumulated, 0), locale)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">{t.depreciation.netBook}</p>
          <p className="text-xl font-bold text-[var(--primary-green)]">
            {formatBaht(allRows.reduce((s, r) => s + r.book, 0), locale)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] bg-gray-50 text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">{t.depreciation.colId}</th>
              <th className="px-4 py-3">{t.depreciation.colDescription}</th>
              <th className="px-4 py-3">{t.depreciation.colPurchase}</th>
              <th className="px-4 py-3">{t.depreciation.colAnnual}</th>
              <th className="px-4 py-3">{t.depreciation.colAccumulated}</th>
              <th className="px-4 py-3">{t.depreciation.colBook}</th>
              <th className="px-4 py-3">{t.depreciation.colRate}</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--card-border)] hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[var(--primary-green)]">{row.id}</td>
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{formatBaht(row.purchase, locale)}</td>
                <td className="px-4 py-3">
                  {row.annual > 0 ? formatBaht(row.annual, locale) : "—"}
                </td>
                <td className="px-4 py-3 text-red-600">
                  {row.accumulated > 0 ? formatBaht(row.accumulated, locale) : "—"}
                </td>
                <td className="px-4 py-3 font-medium">{formatBaht(row.book, locale)}</td>
                <td className="px-4 py-3">{row.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
