"use client";

import { useMemo } from "react";
import { useGoldPrice } from "@/lib/hooks/use-gold-price";
import { useStockQuotes } from "@/lib/hooks/use-stock-quotes";
import type { Messages } from "@/lib/i18n/types";
import { todayIsoDate } from "@/lib/loan-tenure";
import {
  FileUploadZone,
  SectionCard,
} from "./add-asset-form-ui";
import { LiquidityTypePicker } from "./liquidity-form-sections";
import {
  BondFinancialFields,
  BondTransactionFields,
  FundFinancialFields,
  FundTransactionFields,
} from "./liquidity-bond-fund-fields";
import {
  CashFinancialFields,
  CashTransactionFields,
} from "./liquidity-cash-fields";
import {
  LoanFinancialFields,
  LoanTransactionFields,
} from "./liquidity-loan-fields";
import {
  computeLiquidityValues,
  type LiquidityAssetFormState,
} from "./liquidity-form-model";
import {
  GoldFinancialFields,
  GoldTransactionFields,
  StockFinancialFields,
  StockTransactionFields,
} from "./liquidity-stock-gold-fields";

export {
  getLiquidityTypeLabel,
  type LiquidityType,
  type LiquidityAssetFormState,
} from "./liquidity-form-model";

type LiquidityAssetFormProps = {
  state: LiquidityAssetFormState;
  locale: "th" | "en";
  a: Messages["addAsset"];
  onFieldChange: <K extends keyof LiquidityAssetFormState>(
    key: K,
    value: LiquidityAssetFormState[K]
  ) => void;
};

export function LiquidityAssetForm({
  state,
  locale,
  a,
  onFieldChange,
}: LiquidityAssetFormProps) {
  const { buyPerBaht } = useGoldPrice();
  const { quotes } = useStockQuotes(state.symbol ? [state.symbol] : []);
  const marketPrice = quotes[state.symbol.trim().toUpperCase()] ?? null;
  const { cost, current } = useMemo(
    () => computeLiquidityValues(state, { marketPrice, goldBuyPerBaht: buyPerBaht }),
    [state, marketPrice, buyPerBaht]
  );
  const liveValue = state.liquidityType === "bond" ? cost : current;
  const type = state.liquidityType;

  return (
    <>
      <SectionCard
        step={1}
        title={a.sectionAssetType}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
        }
      >
        <LiquidityTypePicker
          value={type}
          onChange={(next) => {
            onFieldChange("liquidityType", next);
            if (next === "gold") onFieldChange("format", "96.5%");
            if (next === "stock") onFieldChange("format", "Scriptless");
            if (next === "cash") onFieldChange("cashHolding", "on_hand");
            if (next === "loan") onFieldChange("borrowedOn", todayIsoDate());
          }}
          a={a}
        />
      </SectionCard>

      <SectionCard
        step={2}
        title={a.sectionTransaction}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        }
      >
        {type === "gold" ? (
          <GoldTransactionFields state={state} a={a} onFieldChange={onFieldChange} />
        ) : type === "bond" ? (
          <BondTransactionFields state={state} a={a} onFieldChange={onFieldChange} />
        ) : type === "fund" ? (
          <FundTransactionFields state={state} a={a} onFieldChange={onFieldChange} />
        ) : type === "cash" ? (
          <CashTransactionFields state={state} a={a} onFieldChange={onFieldChange} />
        ) : type === "loan" ? (
          <LoanTransactionFields
            state={state}
            locale={locale}
            a={a}
            onFieldChange={onFieldChange}
          />
        ) : (
          <StockTransactionFields state={state} a={a} onFieldChange={onFieldChange} />
        )}
      </SectionCard>

      <SectionCard
        step={3}
        title={a.sectionFinancial}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        }
      >
        {type === "gold" ? (
          <GoldFinancialFields
            state={state}
            locale={locale}
            a={a}
            buyPerBaht={buyPerBaht}
            liveValue={liveValue}
            onFieldChange={onFieldChange}
          />
        ) : type === "bond" ? (
          <BondFinancialFields
            state={state}
            locale={locale}
            a={a}
            liveValue={liveValue}
            onFieldChange={onFieldChange}
          />
        ) : type === "fund" ? (
          <FundFinancialFields
            state={state}
            locale={locale}
            a={a}
            liveValue={liveValue}
            onFieldChange={onFieldChange}
          />
        ) : type === "cash" ? (
          <CashFinancialFields
            state={state}
            locale={locale}
            a={a}
            liveValue={liveValue}
            onFieldChange={onFieldChange}
          />
        ) : type === "loan" ? (
          <LoanFinancialFields
            state={state}
            locale={locale}
            a={a}
            liveValue={liveValue}
            onFieldChange={onFieldChange}
          />
        ) : (
          <StockFinancialFields
            state={state}
            locale={locale}
            a={a}
            marketPrice={marketPrice}
            liveValue={liveValue}
            onFieldChange={onFieldChange}
          />
        )}
      </SectionCard>

      <SectionCard
        step={4}
        title={a.sectionDocumentation}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        }
      >
        <FileUploadZone
          files={state.attachments}
          onFilesChange={(files) => onFieldChange("attachments", files)}
          hint={a.uploadHint}
          subhint={a.uploadSubhint}
          removeLabel={a.removeFile}
          fileTooLarge={a.fileTooLarge}
          invalidFileType={a.invalidFileType}
        />
      </SectionCard>
    </>
  );
}
