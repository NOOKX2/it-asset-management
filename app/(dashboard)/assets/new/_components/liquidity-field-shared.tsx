"use client";

import { formatBaht } from "@/lib/format-currency";
import type { Messages } from "@/lib/i18n/types";
import { FieldLabel, TextInput } from "./add-asset-form-ui";
import type { LiquidityAssetFormState } from "./liquidity-form-model";

export type FieldChange = <K extends keyof LiquidityAssetFormState>(
  key: K,
  value: LiquidityAssetFormState[K]
) => void;

export const SELECT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)]";

export function LiveValue({
  label,
  amount,
  locale,
  hint,
}: {
  label: string;
  amount: number;
  locale: "th" | "en";
  hint: string;
}) {
  return (
    <div className="mt-4 rounded-xl bg-gray-100 px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{formatBaht(amount, locale)}</p>
      <p className="mt-1 text-xs text-gray-500">{hint}</p>
    </div>
  );
}

export function HolderIssuerFields({
  state,
  a,
  onFieldChange,
  issuerLabel,
  issuerPlaceholder,
}: {
  state: LiquidityAssetFormState;
  a: Messages["addAsset"];
  onFieldChange: FieldChange;
  issuerLabel?: string;
  issuerPlaceholder?: string;
}) {
  return (
    <>
      <div>
        <FieldLabel>{a.holder}</FieldLabel>
        <TextInput
          value={state.holder}
          onChange={(v) => onFieldChange("holder", v)}
          placeholder={a.holderPlaceholder}
        />
      </div>
      <div>
        <FieldLabel>{issuerLabel ?? a.issuer}</FieldLabel>
        <TextInput
          value={state.issuer}
          onChange={(v) => onFieldChange("issuer", v)}
          placeholder={issuerPlaceholder ?? a.issuerPlaceholder}
        />
      </div>
    </>
  );
}

export function AccountRemarks({
  state,
  a,
  onFieldChange,
}: {
  state: LiquidityAssetFormState;
  a: Messages["addAsset"];
  onFieldChange: FieldChange;
}) {
  return (
    <>
      <div>
        <FieldLabel>{a.accountNumber}</FieldLabel>
        <TextInput
          value={state.accountNumber}
          onChange={(v) => onFieldChange("accountNumber", v)}
          placeholder={a.accountPlaceholder}
        />
      </div>
      <div className="sm:col-span-2">
        <FieldLabel>{a.remarks}</FieldLabel>
        <TextInput
          value={state.remarks}
          onChange={(v) => onFieldChange("remarks", v)}
          placeholder={a.remarksPlaceholder}
        />
      </div>
    </>
  );
}
