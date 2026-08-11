"use client";

import { formatBaht } from "@/lib/format-currency";
import type { Messages } from "@/lib/i18n/types";
import { FieldLabel, NumberInput, TextInput } from "./add-asset-form-ui";
import { LIQUIDITY_TYPE_ICONS } from "./liquidity-type-icons";
import type { LiquidityAssetFormState, LiquidityType } from "./LiquidityAssetForm";

type FieldChange = <K extends keyof LiquidityAssetFormState>(
  key: K,
  value: LiquidityAssetFormState[K]
) => void;

const SELECT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)]";

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
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

export function LiquidityTransactionFields({
  state,
  a,
  onFieldChange,
}: {
  state: LiquidityAssetFormState;
  a: Messages["addAsset"];
  onFieldChange: FieldChange;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>{a.symbolName}</FieldLabel>
        <TextInput
          value={state.symbol}
          onChange={(v) => onFieldChange("symbol", v)}
          placeholder={a.symbolPlaceholder}
        />
      </div>
      <div>
        <FieldLabel>{a.holder}</FieldLabel>
        <TextInput
          value={state.holder}
          onChange={(v) => onFieldChange("holder", v)}
          placeholder={a.holderPlaceholder}
        />
      </div>
      <div>
        <FieldLabel>{a.issuer}</FieldLabel>
        <TextInput
          value={state.issuer}
          onChange={(v) => onFieldChange("issuer", v)}
          placeholder={a.issuerPlaceholder}
        />
      </div>
      <div>
        <FieldLabel>{a.accountNumber}</FieldLabel>
        <TextInput
          value={state.accountNumber}
          onChange={(v) => onFieldChange("accountNumber", v)}
          placeholder={a.accountPlaceholder}
        />
      </div>
      <div>
        <FieldLabel>{a.format}</FieldLabel>
        <select
          value={state.format}
          onChange={(e) => onFieldChange("format", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="Physical">{a.formatPhysical}</option>
          <option value="Scriptless">{a.formatScriptless}</option>
        </select>
      </div>
    </div>
  );
}

export function LiquidityFinancialFields({
  state,
  locale,
  a,
  totalCost,
  onFieldChange,
}: {
  state: LiquidityAssetFormState;
  locale: "th" | "en";
  a: Messages["addAsset"];
  totalCost: number;
  onFieldChange: FieldChange;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>{a.quantity}</FieldLabel>
          <NumberInput value={state.quantity} onChange={(v) => onFieldChange("quantity", v)} min={0} />
        </div>
        <div>
          <FieldLabel>{a.pricePerUnit}</FieldLabel>
          <NumberInput value={state.pricePerUnit} onChange={(v) => onFieldChange("pricePerUnit", v)} min={0} />
        </div>
        <div>
          <FieldLabel>{a.currency}</FieldLabel>
          <select className={SELECT_CLASS} defaultValue="THB">
            <option value="THB">THB - Thai Baht</option>
            <option value="USD">USD - US Dollar</option>
          </select>
        </div>
        <div>
          <FieldLabel>{a.fees}</FieldLabel>
          <NumberInput value={state.fees} onChange={(v) => onFieldChange("fees", v)} min={0} />
        </div>
        <div>
          <FieldLabel>{a.debtors}</FieldLabel>
          <NumberInput value={state.debtors} onChange={(v) => onFieldChange("debtors", v)} min={0} />
        </div>
        <div>
          <FieldLabel>{a.creditors}</FieldLabel>
          <NumberInput value={state.creditors} onChange={(v) => onFieldChange("creditors", v)} min={0} />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>{a.remarks}</FieldLabel>
          <TextInput
            value={state.remarks}
            onChange={(v) => onFieldChange("remarks", v)}
            placeholder={a.remarksPlaceholder}
          />
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-gray-100 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {a.totalCost}
        </p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {formatBaht(totalCost, locale)}
        </p>
      </div>
    </>
  );
}
