"use client";

import type { Messages } from "@/lib/i18n/types";
import { FieldLabel, NumberInput, TextInput } from "./add-asset-form-ui";
import {
  FieldChange,
  HolderIssuerFields,
  LiveValue,
  SELECT_CLASS,
} from "./liquidity-field-shared";
import {
  type CashHolding,
  type LiquidityAssetFormState,
} from "./liquidity-form-model";

export function CashTransactionFields({
  state,
  a,
  onFieldChange,
}: {
  state: LiquidityAssetFormState;
  a: Messages["addAsset"];
  onFieldChange: FieldChange;
}) {
  const isBank = state.cashHolding === "bank_deposit";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FieldLabel>{a.cashHolding}</FieldLabel>
        <select
          value={state.cashHolding}
          onChange={(e) => onFieldChange("cashHolding", e.target.value as CashHolding)}
          className={SELECT_CLASS}
        >
          <option value="on_hand">{a.cashOnHand}</option>
          <option value="bank_deposit">{a.cashBankDeposit}</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {isBank ? a.cashBankHint : a.cashOnHandHint}
        </p>
      </div>
      {isBank ? (
        <HolderIssuerFields
          state={state}
          a={a}
          onFieldChange={onFieldChange}
          issuerLabel={a.cashBank}
          issuerPlaceholder={a.cashBankPlaceholder}
        />
      ) : (
        <div>
          <FieldLabel>{a.holder}</FieldLabel>
          <TextInput
            value={state.holder}
            onChange={(v) => onFieldChange("holder", v)}
            placeholder={a.holderPlaceholder}
          />
        </div>
      )}
      {isBank ? (
        <div>
          <FieldLabel>{a.accountNumber}</FieldLabel>
          <TextInput
            value={state.accountNumber}
            onChange={(v) => onFieldChange("accountNumber", v)}
            placeholder={a.accountPlaceholder}
          />
        </div>
      ) : null}
      <div className={isBank ? "sm:col-span-2" : undefined}>
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

export function CashFinancialFields({
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
        <FieldLabel>{a.cashAmount}</FieldLabel>
        <NumberInput
          value={state.pricePerUnit}
          onChange={(v) => onFieldChange("pricePerUnit", v)}
          min={0}
        />
      </div>
      <LiveValue label={a.liveValue} amount={liveValue} locale={locale} hint={a.priceSourceCash} />
    </>
  );
}
