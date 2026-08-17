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

export function StockTransactionFields({
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
        <FieldLabel>{a.ticker}</FieldLabel>
        <TextInput
          value={state.symbol}
          onChange={(v) => onFieldChange("symbol", v.toUpperCase())}
          placeholder={a.tickerPlaceholder}
        />
      </div>
      <HolderIssuerFields state={state} a={a} onFieldChange={onFieldChange} />
      <AccountRemarks state={state} a={a} onFieldChange={onFieldChange} />
    </div>
  );
}

export function StockFinancialFields({
  state,
  locale,
  a,
  marketPrice,
  liveValue,
  onFieldChange,
}: {
  state: LiquidityAssetFormState;
  locale: "th" | "en";
  a: Messages["addAsset"];
  marketPrice: number | null;
  liveValue: number;
  onFieldChange: FieldChange;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>{a.shares}</FieldLabel>
          <NumberInput value={state.quantity} onChange={(v) => onFieldChange("quantity", v)} min={0} />
        </div>
        <div>
          <FieldLabel>{a.costPerShare}</FieldLabel>
          <NumberInput
            value={state.pricePerUnit}
            onChange={(v) => onFieldChange("pricePerUnit", v)}
            min={0}
          />
        </div>
        <div>
          <FieldLabel>{a.fees}</FieldLabel>
          <NumberInput value={state.fees} onChange={(v) => onFieldChange("fees", v)} min={0} />
        </div>
        <div>
          <FieldLabel>{a.marketPrice}</FieldLabel>
          <input
            readOnly
            value={marketPrice ? marketPrice.toLocaleString(locale === "th" ? "th-TH" : "en-US") : "—"}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500">{a.marketPriceHint}</p>
        </div>
      </div>
      <LiveValue label={a.liveValue} amount={liveValue} locale={locale} hint={a.priceSourceStock} />
    </>
  );
}

export function GoldTransactionFields({
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
      <HolderIssuerFields state={state} a={a} onFieldChange={onFieldChange} />
      <div>
        <FieldLabel>{a.goldPurity}</FieldLabel>
        <select
          value={state.format}
          onChange={(e) => onFieldChange("format", e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)]"
        >
          <option value="96.5%">96.5%</option>
          <option value="99.99%">99.99%</option>
          <option value="Physical">Physical</option>
        </select>
      </div>
      <AccountRemarks state={state} a={a} onFieldChange={onFieldChange} />
    </div>
  );
}

export function GoldFinancialFields({
  state,
  locale,
  a,
  buyPerBaht,
  liveValue,
  onFieldChange,
}: {
  state: LiquidityAssetFormState;
  locale: "th" | "en";
  a: Messages["addAsset"];
  buyPerBaht: number | null;
  liveValue: number;
  onFieldChange: FieldChange;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>{a.goldWeight}</FieldLabel>
          <NumberInput
            value={state.goldWeightBaht}
            onChange={(v) => onFieldChange("goldWeightBaht", v)}
            min={0}
          />
        </div>
        <div>
          <FieldLabel>{a.purchasePrice}</FieldLabel>
          <NumberInput
            value={state.pricePerUnit}
            onChange={(v) => onFieldChange("pricePerUnit", v)}
            min={0}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>{a.goldBuyPrice}</FieldLabel>
          <input
            readOnly
            value={buyPerBaht ? buyPerBaht.toLocaleString(locale === "th" ? "th-TH" : "en-US") : "—"}
            className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-950"
          />
          <p className="mt-1 text-xs text-amber-800">{a.goldBuyHint}</p>
        </div>
      </div>
      <LiveValue label={a.liveValue} amount={liveValue} locale={locale} hint={a.priceSourceGold} />
    </>
  );
}
