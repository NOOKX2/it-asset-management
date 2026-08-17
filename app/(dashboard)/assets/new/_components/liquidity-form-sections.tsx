"use client";

import type { Messages } from "@/lib/i18n/types";
import { LIQUIDITY_TYPE_ICONS } from "./liquidity-type-icons";
import type { LiquidityType } from "./LiquidityAssetForm";

export function LiquidityTypePicker({
  value,
  onChange,
  a,
}: {
  value: LiquidityType;
  onChange: (type: LiquidityType) => void;
  a: Messages["addAsset"];
}) {
  const types: { key: LiquidityType; label: string }[] = [
    { key: "stock", label: a.typeStock },
    { key: "gold", label: a.typeGold },
    { key: "bond", label: a.typeBond },
    { key: "fund", label: a.typeFund },
    { key: "cash", label: a.typeCash },
    { key: "loan", label: a.typeLoan },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {types.map((lt) => {
        const selected = value === lt.key;
        return (
          <button
            key={lt.key}
            type="button"
            onClick={() => onChange(lt.key)}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
              selected
                ? "border-[var(--primary-green)] bg-[var(--light-green-bg)]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                selected
                  ? "bg-[var(--primary-green)] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {LIQUIDITY_TYPE_ICONS[lt.key]}
            </span>
            <span className="text-xs font-semibold text-gray-800">{lt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
