"use client";

import type { Messages } from "@/lib/i18n/types";
import { FieldLabel, NumberInput, TextInput } from "./add-asset-form-ui";
import {
  AccountRemarks,
  FieldChange,
  HolderIssuerFields,
  LiveValue,
} from "./liquidity-field-shared";
import type { LiquidityAssetFormState } from "./liquidity-form-model";

export function BondTransactionFields({
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
      <HolderIssuerFields state={state} a={a} onFieldChange={onFieldChange} />
      <AccountRemarks state={state} a={a} onFieldChange={onFieldChange} />
    </div>
  );
}

export function BondFinancialFields({
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>{a.faceValue}</FieldLabel>
          <NumberInput
            value={state.pricePerUnit}
            onChange={(v) => onFieldChange("pricePerUnit", v)}
            min={0}
          />
        </div>
        <div>
          <FieldLabel>{a.quantity}</FieldLabel>
          <NumberInput value={state.quantity} onChange={(v) => onFieldChange("quantity", v)} min={0} />
        </div>
        <div>
          <FieldLabel>{a.couponYield}</FieldLabel>
          <NumberInput
            value={state.yieldPercent}
            onChange={(v) => onFieldChange("yieldPercent", v)}
            min={0}
          />
        </div>
        <div>
          <FieldLabel>{a.couponFrequency}</FieldLabel>
          <select
            value={state.couponFrequency}
            onChange={(e) =>
              onFieldChange(
                "couponFrequency",
                e.target.value as LiquidityAssetFormState["couponFrequency"]
              )
            }
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)]"
          >
            <option value="">{a.couponFrequency}</option>
            <option value="monthly">{a.freqMonthly}</option>
            <option value="quarterly">{a.freqQuarterly}</option>
            <option value="semiannual">{a.freqSemiannual}</option>
            <option value="annual">{a.freqAnnual}</option>
          </select>
        </div>
      </div>
      <LiveValue label={a.totalCost} amount={liveValue} locale={locale} hint={a.priceSourceBond} />
    </>
  );
}

export function FundTransactionFields({
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
        <FieldLabel>{a.fundName}</FieldLabel>
        <TextInput
          value={state.symbol}
          onChange={(v) => onFieldChange("symbol", v)}
          placeholder={a.fundNamePlaceholder}
        />
      </div>
      <HolderIssuerFields state={state} a={a} onFieldChange={onFieldChange} />
      <AccountRemarks state={state} a={a} onFieldChange={onFieldChange} />
    </div>
  );
}

export function FundFinancialFields({
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>{a.fundUnits}</FieldLabel>
          <NumberInput value={state.quantity} onChange={(v) => onFieldChange("quantity", v)} min={0} />
        </div>
        <div>
          <FieldLabel>{a.pricePerUnit}</FieldLabel>
          <NumberInput
            value={state.pricePerUnit}
            onChange={(v) => onFieldChange("pricePerUnit", v)}
            min={0}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>{a.fundNav}</FieldLabel>
          <NumberInput value={state.navPerUnit} onChange={(v) => onFieldChange("navPerUnit", v)} min={0} />
          <p className="mt-1 text-xs text-gray-500">{a.fundNavHint}</p>
        </div>
      </div>
      <LiveValue label={a.fundAssetValue} amount={liveValue} locale={locale} hint={a.priceSourceFund} />
    </>
  );
}
