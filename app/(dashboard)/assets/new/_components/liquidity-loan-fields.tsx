"use client";

import type { Messages } from "@/lib/i18n/types";
import {
  daysOutstanding,
  formatDaysOutstanding,
} from "@/lib/loan-tenure";
import { FieldLabel, NumberInput, TextInput } from "./add-asset-form-ui";
import {
  FieldChange,
  LiveValue,
  SELECT_CLASS,
} from "./liquidity-field-shared";
import type { LiquidityAssetFormState } from "./liquidity-form-model";

export function LoanTransactionFields({
  state,
  locale,
  a,
  onFieldChange,
}: {
  state: LiquidityAssetFormState;
  locale: "th" | "en";
  a: Messages["addAsset"];
  onFieldChange: FieldChange;
}) {
  const days = daysOutstanding(state.borrowedOn);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>{a.borrower}</FieldLabel>
        <TextInput
          value={state.borrowerName}
          onChange={(v) => onFieldChange("borrowerName", v)}
          placeholder={a.borrowerPlaceholder}
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
        <FieldLabel>{a.borrowedOn}</FieldLabel>
        <input
          type="date"
          value={state.borrowedOn}
          onChange={(e) => onFieldChange("borrowedOn", e.target.value)}
          className={SELECT_CLASS}
        />
        <p className="mt-1 text-xs text-gray-500">{a.borrowedOnHint}</p>
      </div>
      <div>
        <FieldLabel>{a.daysOutstanding}</FieldLabel>
        <input
          readOnly
          value={days == null ? "—" : formatDaysOutstanding(days, locale)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800"
        />
        <p className="mt-1 text-xs text-gray-500">{a.daysOutstandingHint}</p>
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
  );
}

export function LoanFinancialFields({
  state,
  locale,
  a,
  liveValue,
  onFieldChange,
}: {
  state: LiquidityAssetFormState;
  locale: "th" | "en";
  a: Messages["addAsset"];
  liveValue: number;
  onFieldChange: FieldChange;
}) {
  return (
    <>
      <div>
        <FieldLabel>{a.loanPrincipal}</FieldLabel>
        <NumberInput
          value={state.pricePerUnit}
          onChange={(v) => onFieldChange("pricePerUnit", v)}
          min={0}
        />
      </div>
      <LiveValue
        label={a.liveValue}
        amount={liveValue}
        locale={locale}
        hint={a.priceSourceLoan}
      />
    </>
  );
}
